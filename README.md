# Luis Augusto — contact card

Luis’s digital business card, designed for [luis.app/contact](https://luis.app/contact). Built with Next.js, TypeScript, and the supplied Business Card design and portrait.

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3100/contact. The application uses `/contact` as its Next.js base path, including all assets and API routes.

```sh
npm run test       # feed parsing, failures, and vCard format
npm run typecheck
npm run build
npm start
```

## Content

`lib/profile.ts` is the single source of truth for Luis’s confirmed public contact details and publication links. The phone number is included in the downloadable vCard. Replace `public/portrait.jpg` to update the photo; it also appears in the vCard and social previews. Fonts are self-hosted and retain their upstream licenses in their npm packages.

The page preserves the supplied design, follows the system color scheme on first visit, and remembers a manual theme selection. Contact links and the vCard work without JavaScript.

## Writing

The server reads `https://luisaugusto.substack.com/feed` and caches successfully parsed results for one hour. It displays up to three newest published articles, linking directly to each post. An empty feed hides the complete writing section; there are no sample articles or invented publication dates.

A failed refresh throws inside Next.js’s data cache so an existing successful result remains available. With no cached result, the section stays hidden. Failures are logged with `[writing]`; the contact page still works. `/contact/api/posts` returns `{ posts, checkedAt }` on success and HTTP 503 with `{ posts: [], status: "unavailable" }` when no feed result is available. The timestamp describes the feed fetch, not the page request.

## Deployment

Vercel runs tests before its production build. The connected GitHub repository deploys `main` to production and other branches to previews. No application secrets or paid integrations are required.

The domain remains on the existing `luisaugusto-next` Vercel project. Its project routing rules forward `/contact` and `/contact/*` to this project’s stable production domain. The homepage continues to lead to Substack. See `docs/routing.md` for the deployed routing configuration and rollback instructions.

## Source assets

The portrait and visual design were supplied by Luis in `business_card.zip`. The export runtime and sample articles are intentionally not shipped. Contact details were confirmed for public publication on September 21, 2026.
