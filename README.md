# titan-web

Titan Flooring's public website (titanfloors.ca), rebuilt off WordPress as Next.js on
Vercel. Full architecture, rationale, and migration plan live in the companion repo:
[`titan-agents-repo/methods/website-architecture.md`](https://github.com/albertngo/titan-agents-repo/blob/main-agents/methods/website-architecture.md).

**Phase 1 scope:** homepage only. No catalogue, no blog import, no lead forms yet —
see the architecture doc's migration plan for what comes next.

Brand assets in `public/brand/` (wordmark, Cysan + PT Serif fonts) are Titan's real
2024 brand guide (Social Estates), not placeholders. Content data in `lib/site.ts` is
hand-copied from `titan-agents-repo/platform-settings/website.json` — update both when
NAP or nav changes.
