# Luis Augusto — contact card

Luis’s digital business card, designed for [contact.luis.app](https://contact.luis.app). Built with Next.js and TypeScript, with a mobile-first rose paper sleeve and a static cotton-paper card.

## Development

Requires Node.js 22 or newer. Signing the Wallet pass also requires Python 3 and OpenSSL.

```sh
npm ci
npm run dev
```

Open http://localhost:3100/contact. The application retains `/contact` as its Next.js base path, including all assets and API routes. On Vercel, `vercel.json` rewrites `/` to `/contact` so the public page is served at https://contact.luis.app without changing the browser URL.

```sh
npm run test       # feed, vCard, Wallet content/assets and signing failure checks
npm run typecheck
npm run build
npm start
```

## Content

`lib/profile.ts` is the single source of truth for Luis’s confirmed public contact details and publication links, including the Wallet pass. The phone number is included in the downloadable vCard. Replace `public/portrait.jpg` to update the photo on the page, in the vCard, social previews, and both Wallet portraits. The page palette lives in `app/globals.css`; `lib/brand.ts` retains the existing dark Wallet palette. Fonts are self-hosted and retain their upstream licenses in their npm packages.

The page uses the approved light rose palette, an embossed LA monogram in the page header, and a two-line name beside the portrait. The card stays in its sleeve, showing the name, portrait, and role without an animation or reveal control. Accessible icon links below the email lead to GitHub, LinkedIn, and Writing on Substack. Contact links and the vCard work without JavaScript.

## Apple Wallet

The pass source lives in [`wallet/`](wallet/README.md). `npm run dev` and `npm run build` regenerate it from the shared content and portrait. Production builds sign and validate the pass before publishing `/contact/Luis-Augusto.pkpass`. The official Add to Apple Wallet badge appears next to Save contact on iPhone and iPod browsers after JavaScript loads; desktop, Android, and iPad browsers keep the contact button alone.

Change the shared sources and deploy once to update both the page and the downloadable pass. Cards already saved in Wallet must be re-added to receive changes; this project does not run an automatic pass update service.

## Writing

The server reads `https://luisaugusto.substack.com/feed` and caches successfully parsed results for one hour. It displays up to three newest published articles, linking directly to each post. An empty feed hides the complete writing section; there are no sample articles or invented publication dates.

A failed refresh throws inside Next.js’s data cache so an existing successful result remains available. With no cached result, the section stays hidden. Failures are logged with `[writing]`; the contact page still works. `/contact/api/posts` returns `{ posts, checkedAt }` on success and HTTP 503 with `{ posts: [], status: "unavailable" }` when no feed result is available. The timestamp describes the feed fetch, not the page request.

## Deployment

Vercel runs tests and the TypeScript check before its production build. The connected GitHub repository deploys `main` to production and other branches to previews. Production-only sensitive environment variables hold the existing Wallet signing key and certificate (see [`wallet/README.md`](wallet/README.md)). Missing or invalid credentials fail the production build and leave the previous release active. Previews without credentials build normally with Wallet downloads disabled.

`contact.luis.app` is attached directly to the `business-card` Vercel project. The existing `luis.app` and `www.luis.app` domain assignments remain on the `luisaugusto-next` Vercel project, but their DNS has been moved to Substack separately. The old `/contact` proxy rules remain recorded there and only apply if those hostnames resolve to Vercel. The old `luis.app/contact` URL is not expected to work with the Substack DNS configuration. DNS and email records are managed separately and are not changed by deployment. See `docs/routing.md` for routing, DNS setup, and rollback instructions.

## Source assets

The portrait was supplied by Luis in `business_card.zip`. The new design follows the approved Rose Pocket mockups in `design-explorations/mobile/header-monogram-rose-pocket/`. Optimized textures, the embossed monogram, and the sleeve artwork live in `public/textures/`. The identity, profile links, and controls remain live HTML. Contact details were confirmed for public publication on September 21, 2026.

The unmodified Add to Apple Wallet SVG is Apple-provided artwork, used under the Wallet Marketing Artwork License Agreement accepted by Luis’s authorization. Apple and Apple Wallet are trademarks of Apple Inc. See [`docs/credits.md`](docs/credits.md).
