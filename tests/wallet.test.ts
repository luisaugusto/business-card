import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmod, cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import sharp from "sharp";
import { brandVariables, darkPalette, walletRgb } from "../lib/brand";
import { profile, portraitFilename } from "../lib/profile";
import { supportsWalletDownload } from "../lib/wallet-device";
import { writeTemplate } from "../wallet/assets";
import { createPass, walletIdentity } from "../wallet/model";

test("pass details and branding derive from the same website profile", () => {
  const contact = { ...profile, name: "Renée & Luis", title: "Updated role", email: "new@luis.app", canonical: "https://luis.app/contact?source=wallet", city: "New city" };
  const pass = createPass(contact);
  assert.equal(pass.logoText, contact.name);
  assert.equal(pass.organizationName, contact.name);
  assert.equal(pass.generic.primaryFields[0].value, contact.name);
  assert.equal(pass.generic.secondaryFields[0].value, contact.title);
  assert.equal(pass.generic.auxiliaryFields[0].value, contact.email);
  assert.equal(pass.generic.backFields[0].value, contact.canonical);
  assert.equal(pass.generic.backFields[1].attributedValue, '<a href="mailto:new@luis.app">new@luis.app</a>');
  assert.ok(pass.generic.backFields[2].value.includes(contact.city));
  assert.equal(pass.barcodes[0].message, contact.canonical);
  assert.equal(pass.backgroundColor, walletRgb(darkPalette.bg));
  assert.equal(pass.foregroundColor, "rgb(244,241,237)");
  assert.equal(pass.labelColor, "rgb(236,168,81)");
  assert.equal(brandVariables["--brand-bg"], "oklch(0.18 0.008 80)");
  assert.equal(pass.serialNumber, walletIdentity.serialNumber);
  assert.throws(() => createPass({ ...profile, canonical: "http://luis.app/contact" }), /HTTPS/);
});

test("Wallet visibility supports iPhone browsers and iPod, excluding other devices", () => {
  for (const agent of [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 27_0 like Mac OS X) AppleWebKit/605.1.15 Version/27.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 27_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/140.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X)",
  ]) assert.equal(supportsWalletDownload(agent), true);
  for (const agent of ["", "Mozilla/5.0 (Linux; Android 16)", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "Mozilla/5.0 (iPad; CPU OS 27_0 like Mac OS X)"])
    assert.equal(supportsWalletDownload(agent), false);
});

test("both pass photos regenerate from the supplied portrait at all resolutions", async () => {
  const temp = await mkdtemp(join(tmpdir(), "wallet-photo-test-"));
  try {
    const portrait = await readFile(new URL(`../public/${portraitFilename}`, import.meta.url));
    await writeTemplate(temp, portrait);
    for (const scale of [1, 2, 3]) {
      const suffix = scale === 1 ? "" : `@${scale}x`;
      for (const [name, size] of [["logo", 38], ["thumbnail", 90]] as const) {
        const n = scale * size;
        const { data, info } = await sharp(join(temp, `${name}${suffix}.png`)).raw().toBuffer({ resolveWithObject: true });
        assert.deepEqual([info.width, info.height, info.channels], [n, n, 4]);
        assert.equal(data[3], 0); // circular, transparent corner
        const expected = await sharp(portrait).resize(n, n, { fit: "cover" }).ensureAlpha().raw().toBuffer();
        const center = (Math.floor(n / 2) * n + Math.floor(n / 2)) * 4;
        assert.deepEqual(data.subarray(center, center + 4), expected.subarray(center, center + 4));
      }
    }
  } finally { await rm(temp, { recursive: true, force: true }); }
});

test("unsigned previews remove stale passes and production rejects absent or expired credentials", async () => {
  const root = process.cwd();
  const temp = await mkdtemp(join(tmpdir(), "wallet-build-test-"));
  try {
    await mkdir(join(temp, "wallet")); await mkdir(join(temp, "public"));
    await cp(join(root, "lib"), join(temp, "lib"), { recursive: true });
    for (const file of ["build.ts", "model.ts", "assets.ts", "sign-pass.py"])
      await cp(join(root, "wallet", file), join(temp, "wallet", file));
    await cp(join(root, "wallet", "certificates"), join(temp, "wallet", "certificates"), { recursive: true });
    await cp(join(root, "public", portraitFilename), join(temp, "public", portraitFilename));
    await symlink(join(root, "node_modules"), join(temp, "node_modules"), "dir");
    const env = { ...process.env, VERCEL: "1", VERCEL_ENV: "preview", WALLET_SIGNING_KEY_BASE64: "", WALLET_SIGNING_CERT_BASE64: "", WALLET_REQUIRE_SIGNING: "" };
    await writeFile(join(temp, "public", "Luis-Augusto.pkpass"), "stale");
    const run = (overrides = {}) => spawnSync(process.execPath, ["--import", "tsx", "wallet/build.ts"], { cwd: temp, env: { ...env, ...overrides }, encoding: "utf8" });
    assert.equal(run().status, 0);
    await assert.rejects(readFile(join(temp, "public", "Luis-Augusto.pkpass")), { code: "ENOENT" });
    const missing = run({ VERCEL_ENV: "production" });
    assert.notEqual(missing.status, 0);
    assert.match(missing.stderr, /Production requires/);
    const key = join(temp, "test-key.pem"), csr = join(temp, "test.csr"), expired = join(temp, "expired.pem");
    execFileSync("openssl", ["req", "-new", "-newkey", "rsa:2048", "-nodes", "-keyout", key, "-out", csr,
      "-subj", `/UID=${walletIdentity.passTypeIdentifier}/OU=${walletIdentity.teamIdentifier}/CN=Expired test`], { stdio: "ignore" });
    await chmod(key, 0o600);
    const initial = join(temp, "initial.pem"), issued = join(temp, "issued.pem"), config = join(temp, "ca.cnf");
    execFileSync("openssl", ["x509", "-req", "-in", csr, "-signkey", key, "-days", "1", "-out", initial], { stdio: "ignore" });
    await mkdir(join(temp, "newcerts"));
    await writeFile(join(temp, "index.txt"), "");
    await writeFile(join(temp, "serial"), "01\n");
    await writeFile(config, `[ca]\ndefault_ca=test\n[test]\ndatabase=${temp}/index.txt\nnew_certs_dir=${temp}/newcerts\nserial=${temp}/serial\nprivate_key=${key}\ncertificate=${initial}\ndefault_md=sha256\npolicy=any\n[any]\ncommonName=supplied\n`);
    execFileSync("openssl", ["ca", "-selfsign", "-batch", "-preserveDN", "-config", config, "-in", csr,
      "-startdate", "20200101000000Z", "-enddate", "20210101000000Z", "-out", issued], { stdio: "ignore" });
    execFileSync("openssl", ["x509", "-in", issued, "-out", expired], { stdio: "ignore" });
    assert.notEqual(spawnSync("openssl", ["x509", "-in", expired, "-checkend", "0", "-noout"]).status, 0);
    const invalid = run({ VERCEL_ENV: "production", WALLET_SIGNING_KEY_BASE64: (await readFile(key)).toString("base64"), WALLET_SIGNING_CERT_BASE64: (await readFile(expired)).toString("base64") });
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /validation or signing failed/);
    await assert.rejects(readFile(join(temp, "public", "Luis-Augusto.pkpass")), { code: "ENOENT" });
  } finally { await rm(temp, { recursive: true, force: true }); }
});
