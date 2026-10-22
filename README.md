# titan-web

Titan Flooring's public website (titanfloors.ca), rebuilt off WordPress as Next.js on
Vercel. Full architecture, rationale, and migration plan live in the companion repo:
[`titan-agents-repo/methods/website-architecture.md`](https://github.com/albertngo/titan-agents-repo/blob/main-agents/methods/website-architecture.md).

## This branch: `clone/current-site`

A 1:1 rebuild of the **current** titanfloors.ca homepage, made with the
[ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template)
(MIT, licence in `LICENSE-cloner-template`). `main` holds the separate brand-guide homepage.

- Page: `src/app/page.tsx` → `src/components/sites/titanfloors/` (content lives in `site-data.ts`,
  styles in `titanfloors.css`).
- Images and fonts: `public/sites/titanfloors/` — downloaded from the live site.
- What was measured, and every deliberate difference from the live page:
  `docs/research/titanfloors/home/BRIEF.md`.
- Links to pages not rebuilt yet point back to the live site.

```
npm install
npm run dev      # http://localhost:3000
npm run check    # lint + typecheck + production build
```

To clone more pages: `/clone-website https://titanfloors.ca/<page>/` (the workflow is in
`.agents/skills/clone-website/SKILL.md`).

## Designing with AI

`.claude/skills/` carries vendored design skills (taste-skill) and 74 `DESIGN.md`
references from real sites. For page or section work, load `design-taste-frontend` (new)
or `redesign-existing-projects` (existing) and pick one to three references from
`design-md-references`. Borrow structure from them, never another brand; see
`.claude/skills/README.md`.

Brand assets in `public/brand/` (wordmark, Cysan + PT Serif fonts) are Titan's real 2024
brand guide (Social Estates), not placeholders.
