#!/usr/bin/env python3
"""Sign this pass with local PEM key + Apple-issued certificates. No secrets are printed."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parent

def run(*args, data=None):
    result = subprocess.run([str(x) for x in args], input=data, capture_output=True, check=True)
    return result.stdout

def clean(value):
    if isinstance(value, dict):
        return {k: clean(v) for k, v in value.items() if not k.startswith('_')}
    if isinstance(value, list):
        return [clean(v) for v in value]
    return value

def pem(source, target):
    fmt = 'PEM' if Path(source).read_bytes().startswith(b'-----BEGIN') else 'DER'
    run('openssl', 'x509', '-in', source, '-inform', fmt, '-out', target)

parser = argparse.ArgumentParser()
parser.add_argument('--certificate', type=Path, required=True)
parser.add_argument('--key', type=Path, required=True)
parser.add_argument('--wwdr', type=Path, required=True)
parser.add_argument('--apple-root', type=Path, required=True)
args = parser.parse_args()
assert args.key.stat().st_mode & 0o077 == 0, 'Signing key must have owner-only permissions.'

source = ROOT / 'Luis-Augusto.pkpasstemplate'
pass_data = clean(json.loads((source / 'pass.json').read_text()))
assert pass_data['passTypeIdentifier'] == 'pass.app.luis.contact'
assert pass_data['teamIdentifier'] == 'A2C6C68DY8'
assert pass_data['barcodes'][0]['message'].startswith('https://')
assert pass_data['barcodes'][0]['format'] == 'PKBarcodeFormatQR'
assert pass_data['generic']['primaryFields'][0]['value'] == pass_data['logoText']

with tempfile.TemporaryDirectory(prefix='luis-wallet-') as work:
    work = Path(work)
    cert, wwdr, apple_root = [work / name for name in ('certificate.pem','wwdr.pem','root.pem')]
    pem(args.certificate, cert)
    pem(args.wwdr, wwdr)
    pem(args.apple_root, apple_root)
    subject = run('openssl', 'x509', '-in', cert, '-noout', '-subject', '-nameopt', 'RFC2253').decode()
    assert re.search(r'(?:^|,)UID=pass\.app\.luis\.contact(?:,|$)', subject.replace('subject=', '').strip()), 'Pass ID does not match signing certificate.'
    assert re.search(r'(?:^|,)OU=A2C6C68DY8(?:,|$)', subject.replace('subject=', '').strip()), 'Developer team does not match signing certificate.'
    run('openssl','x509','-in',cert,'-checkend','0','-noout')
    run('openssl','verify','-CAfile',apple_root,'-untrusted',wwdr,cert)
    certificate_public = run('openssl','x509','-in',cert,'-pubkey','-noout')
    key_public = run('openssl','pkey','-in',args.key,'-pubout')
    assert certificate_public == key_public, 'Certificate does not match local signing key.'

    files = {'pass.json': (json.dumps(pass_data,ensure_ascii=False,indent=2)+'\n').encode()}
    for path in source.glob('*.png'):
        files[path.name] = path.read_bytes()
    for required in ['icon.png','icon@2x.png','icon@3x.png','logo.png','logo@2x.png','logo@3x.png','thumbnail.png','thumbnail@2x.png','thumbnail@3x.png']:
        assert required in files, f'Missing {required}'
    manifest = json.dumps({name:hashlib.sha1(data).hexdigest() for name,data in sorted(files.items())},sort_keys=True).encode()
    (work/'manifest.json').write_bytes(manifest)
    run('openssl','cms','-sign','-binary','-md','sha256','-in',work/'manifest.json','-signer',cert,'-inkey',args.key,'-certfile',wwdr,'-outform','DER','-out',work/'signature')
    run('openssl','cms','-verify','-binary','-inform','DER','-in',work/'signature','-content',work/'manifest.json','-CAfile',apple_root,'-purpose','any','-out',work/'verified.json')
    assert (work/'verified.json').read_bytes() == manifest
    files['manifest.json'] = manifest
    files['signature'] = (work/'signature').read_bytes()
    output = ROOT/'Luis-Augusto.pkpass'
    with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED) as archive:
        for name,data in sorted(files.items()): archive.writestr(name,data)
    with zipfile.ZipFile(output) as archive:
        checked=json.loads(archive.read('manifest.json'))
        assert set(archive.namelist()) == set(checked) | {'manifest.json','signature'}
        for name,digest in checked.items(): assert hashlib.sha1(archive.read(name)).hexdigest() == digest
    report = {
        'passFile': output.name,
        'passTypeIdentifier': pass_data['passTypeIdentifier'],
        'teamIdentifier':pass_data['teamIdentifier'],
        'serialNumber':pass_data['serialNumber'],
        'qrDestination':pass_data['barcodes'][0]['message'],
        'manifestVerified':True,
        'signatureVerified':True,
        'appleCertificateChainVerified':True,
        'certificate':run('openssl','x509','-in',cert,'-noout','-subject','-issuer','-dates','-fingerprint','-sha256').decode().strip(),
        'sha256':hashlib.sha256(output.read_bytes()).hexdigest()
    }
    (ROOT/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))
