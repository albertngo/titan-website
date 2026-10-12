# titan-web

Titan Flooring's public website (titanfloors.ca), rebuilt off WordPress as Next.js on
Vercel. Full architecture, rationale, and migration plan live in the companion repo:
[`titan-agents-repo/methods/website-architecture.md`](https://github.com/albertngo/titan-agents-repo/blob/main-agents/methods/website-architecture.md).

**Phase 1 scope:** homepage only. No catalogue, no blog import, no lead forms yet —
see the architecture doc's migration plan for what comes next.

**Designing with AI:** `.claude/skills/` carries vendored design skills (taste-skill) and
74 `DESIGN.md` references from real sites. For page or section work, load
`design-taste-frontend` (new) or `redesign-existing-projects` (existing) and pick one to
three references from `design-md-references`. Borrow structure from them, never another
brand; see `.claude/skills/README.md`.

Brand assets in `public/brand/` (wordmark, Cysan + PT Serif fonts) are Titan's real
2024 brand guide (Social Estates), not placeholders. Content data in `lib/site.ts` is
hand-copied from `titan-agents-repo/platform-settings/website.json` — update both when
NAP or nav changes.
