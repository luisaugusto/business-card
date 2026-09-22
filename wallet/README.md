# Apple Wallet contact pass

The website and pass are one project. Edit `../lib/profile.ts` for name, role, email, location and HTTPS QR destination, `../public/portrait.jpg` for the photo, and `../lib/brand.ts` for the dark colors. Pass layout and stable identity are in `model.ts`; image generation is in `assets.ts`.

From the repository root:

```sh
npm ci
npm run wallet:build
```

This regenerates `Luis-Augusto.pkpasstemplate/` for Pass Designer. When signing credentials are available, it also creates `Luis-Augusto.pkpass`, `validation.json`, and `../public/Luis-Augusto.pkpass`. Generated files are ignored by Git. Treat the TypeScript sources as authoritative: edits made directly to the generated Pass Designer template will be replaced on the next build.

On Luis's Mac, the old `~/Documents/Wallet/Luis-Augusto` path links to this directory. The previous standalone project is retained locally in the ignored `.previous-standalone/` backup; it is not used by builds or uploaded to GitHub or Vercel.

## Local credentials

By default the builder reads `pass-key.pem` and `pass.cer` from `~/.local/share/luis-wallet-signing`. `WALLET_SIGNING_DIR` can select another directory. Keep the key owner-readable only (`chmod 600`); never place signing credentials in the repository or `public/`.

Without credentials, local and preview builds generate the template and disable the Wallet download. `WALLET_REQUIRE_SIGNING=1 npm run build` makes missing credentials a fatal error locally too.

## Production signing

The `business-card` Vercel project uses two **sensitive, production-only** variables:

- `WALLET_SIGNING_KEY_BASE64`: base64-encoded existing PEM private key.
- `WALLET_SIGNING_CERT_BASE64`: base64-encoded Apple-issued Pass Type ID certificate, DER or PEM.

Do not use `NEXT_PUBLIC_` for either variable. The build decodes them into temporary files with restricted permissions, signs the pass, verifies the certificate, Apple chain, detached CMS signature and file manifest, then deletes the temporary files. Logs report status without credential values. Only the signed pass is served; credentials and generated authoring files are excluded from deployment uploads.

The public Apple G4 intermediate and root certificate are in `certificates/`. The signer requires Python 3 and OpenSSL, available in the configured Vercel build image. It checks the certificate's expiry, pass identifier, developer team, and matching private key. A failed production signing check fails deployment before it can replace the current site.

The current certificate expires **October 22, 2027 at 04:15:43 UTC**. Renew the Apple Pass Type ID certificate before then, update the production certificate variable and local `pass.cer`, and rebuild. If rotating the key too, update both credentials together. Keep pass ID `pass.app.luis.contact`, team `A2C6C68DY8`, and serial `luis-contact-001` stable.

## Download and device behavior

The public URL is **https://luis.app/contact/Luis-Augusto.pkpass**. The response uses `application/vnd.apple.pkpass`, inline disposition and revalidation so a later release supplies the latest file. The page shows Apple's badge on iPhone/iPod browsers after hydration when the release contains a signed pass. It does not require Apple Pay availability. Other devices retain the ordinary contact download.

Apple controls pass layout: Pass Designer, macOS previews and iPhone Wallet can differ, and the auxiliary email may be omitted from the front when space is limited. The website and email are also in Pass Details; the email uses an explicit mailto link. The QR points to `profile.canonical`. The pass header keeps Luis's photo and full name.

Deploying updates the downloadable file, not passes already installed on devices. Re-add the pass to obtain the latest details. No registration server, APNs service, or pass-update authentication is configured. Browser emulation and signature validation do not substitute for checking Add to Wallet and links on a physical iPhone.
