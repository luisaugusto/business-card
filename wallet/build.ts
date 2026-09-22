import { access, copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { portraitFilename } from "../lib/profile";
import { writeTemplate } from "./assets";

const wallet = dirname(fileURLToPath(import.meta.url));
const root = dirname(wallet);
const publicPass = join(root, "public", "Luis-Augusto.pkpass");
const localPass = join(wallet, "Luis-Augusto.pkpass");
const validation = join(wallet, "validation.json");
const template = join(wallet, "Luis-Augusto.pkpasstemplate");

async function exists(path: string) { try { await access(path); return true; } catch { return false; } }

async function build() {
  // Never carry a signed output from another build into an unsigned preview.
  await Promise.all([publicPass, localPass, validation].map(path => rm(path, { force: true })));
  await rm(template, { recursive: true, force: true });
  await writeTemplate(template, await readFile(join(root, "public", portraitFilename)));

  const hosted = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
  const production = process.env.VERCEL_ENV === "production" || process.env.WALLET_REQUIRE_SIGNING === "1";
  const keyValue = process.env.WALLET_SIGNING_KEY_BASE64;
  const certValue = process.env.WALLET_SIGNING_CERT_BASE64;
  const localDir = process.env.WALLET_SIGNING_DIR || join(homedir(), ".local", "share", "luis-wallet-signing");
  let key = join(localDir, "pass-key.pem"), certificate = join(localDir, "pass.cer");
  let temporary: string | undefined;
  try {
    if (keyValue || certValue) {
      if (!keyValue || !certValue) throw new Error("Both Wallet signing environment variables are required.");
      temporary = await mkdtemp(join(tmpdir(), "wallet-signing-"));
      key = join(temporary, "pass-key.pem"); certificate = join(temporary, "pass.cer");
      await writeFile(key, Buffer.from(keyValue, "base64"), { mode: 0o600 });
      await writeFile(certificate, Buffer.from(certValue, "base64"), { mode: 0o600 });
    } else if (hosted || !await exists(key) || !await exists(certificate)) {
      if (production) throw new Error("Production requires WALLET_SIGNING_KEY_BASE64 and WALLET_SIGNING_CERT_BASE64.");
      console.log("[wallet] Template generated; signing credentials absent, so Wallet downloads are disabled for this build.");
      return;
    }
    const result = spawnSync("python3", [join(wallet, "sign-pass.py"), "--certificate", certificate, "--key", key,
      "--wwdr", join(wallet, "certificates", "AppleWWDRCAG4.cer"), "--apple-root", join(wallet, "certificates", "AppleIncRootCertificate.cer")], { encoding: "utf8" });
    if (result.status !== 0) throw new Error("Wallet certificate validation or signing failed. Check the certificate, key, Python 3, and OpenSSL; no pass was published.");
    await mkdir(join(root, "public"), { recursive: true });
    await copyFile(localPass, publicPass);
    console.log("[wallet] Signed pass generated; certificate chain, signature, and manifest verified.");
  } finally {
    if (temporary) await rm(temporary, { recursive: true, force: true });
  }
}
build().catch(error => { console.error(`[wallet] ${error.message}`); process.exitCode = 1; });
