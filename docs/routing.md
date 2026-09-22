# Production routing

Configured September 21, 2026 (Pacific time).

- Public page: https://luis.app/contact
- Source: https://github.com/luisaugusto/business-card
- Application project: https://vercel.com/luisaugustos-projects/business-card
- Application project ID: `prj_98rRo3Y6U54bj3xHBMvyEscbSS3Z`
- Stable origin: https://business-card-luisaugustos-projects.vercel.app
- Domain-owning project: https://vercel.com/luisaugustos-projects/luisaugusto-next
- Domain-owning project ID: `prj_rfNGbnUPIJGWfrzpqESLEi0ZtXLD`
- Team: `luisaugustos-projects`
- Published routing version: `24236548-03f3-41e6-8341-cdb7952571c4`

Both `luis.app` and `www.luis.app` connect to production on the domain-owning project. There is no domain-wide redirect on `luis.app`; path-specific routing now preserves its previous behavior outside `/contact`.

The following project rules run in this order:

| Name | Source regular expression | Host condition | Action |
| --- | --- | --- | --- |
| Contact canonical hostname | `^/contact(/.*)?$` | `www.luis.app` | 308 to `https://luis.app/contact$1` |
| Contact card application | `^/contact(/.*)?$` | Any | Rewrite to `https://business-card-luisaugustos-projects.vercel.app/contact$1` |
| Preserve apex redirect outside contact | `^/(?!contact(?:/\|$))(.*)$` | `luis.app` | 308 to `https://www.luis.app/$1` |

The third expression is shown with an escaped pipe for Markdown table formatting; its actual regular expression is:

```text
^/(?!contact(?:/|$))(.*)$
```

`/contact/` normalizes to `/contact` through Next.js. The rewrite preserves the `/contact` prefix for fonts, optimized images, JavaScript, CSS, the RSS API, and the vCard. The homepage keeps the existing Substack redirect page.

## Changes and rollback

Application changes are deployed by pushing to `main`. The origin in the routing rule is a stable project alias, not a per-deployment URL. Preview deployment protection remains enabled; the production project alias is public so the domain-owning project can proxy it.

For an application regression, roll back the `business-card` project deployment in Vercel. This does not require editing domain routing.

To restore the exact pre-contact domain behavior:

1. In the domain-owning project's CDN routing rules, remove the three contact-related rules above and publish. The prior rule list was empty.
2. In that project's Domains settings, change `luis.app` from Production to a 308 redirect to `www.luis.app`.
3. Verify both homepage hostnames still reach Substack.

Do those steps in that order to avoid a redirect loop between `www.luis.app/contact` and `luis.app/contact`. The original domain and routing state is recorded in `routing-before.json`. No DNS records were changed.

## Verification performed

- Production build and TypeScript check passed; eight automated tests passed.
- Desktop dark and mobile light layouts visually checked against the supplied design.
- Theme toggle persisted across reload; no mobile horizontal overflow.
- `https://luis.app/contact` returned 200 with the correct canonical URL.
- `www.luis.app/contact` redirected to the apex contact URL; `/contact/` normalized correctly.
- Both homepage hostnames retained the Substack destination.
- Contact assets and vCard returned 200 through the public URL.
- A browser click downloaded `Luis-Augusto.vcf`; automated tests verified all confirmed fields, 75-octet folding, and the embedded portrait.
- The live feed API returned 200 with an empty post list, consistent with the publication. No placeholder writing is shown.
- No browser console errors or matching Vercel error/warning logs were found during verification.

Import into a phone's Contacts application has not been physically tested.
