# titan-web

Titan Flooring's public website (titanfloors.ca), rebuilt off WordPress as Next.js on
Vercel. Full architecture, rationale, and migration plan live in the companion repo:
[`titan-agents-repo/methods/website-architecture.md`](https://github.com/albertngo/titan-agents-repo/blob/main-agents/methods/website-architecture.md).

**Scope so far:** the homepage, and the blog route (2026-10-07): flat `/<slug>/` posts
rendered from `content/blog/*.mdx`, `/blog/` index, sitemap, JSON-LD. Posts are written
only by the content engine in titan-agents-repo through pull requests; `npm run build`
runs `scripts/validate-content.mjs` first so a bad post fails the Vercel check. No
catalogue, no legacy import (Phase 1b), no lead forms yet.

Set `NEXT_PUBLIC_SITE_URL` in Vercel to the production host (the Vercel URL until DNS
cuts over, then `https://titanfloors.ca`); `lib/site.ts` → `siteUrl` reads it.

Brand assets in `public/brand/` (wordmark, Cysan + PT Serif fonts) are Titan's real
2024 brand guide (Social Estates), not placeholders. Content data in `lib/site.ts` is
hand-copied from `titan-agents-repo/platform-settings/website.json` — update both when
NAP or nav changes.
