# titan-web

Titan Flooring's public website (titanfloors.ca), rebuilt off WordPress as Next.js on
Vercel. Full architecture, rationale, and migration plan live in the companion repo:
[`titan-agents-repo/methods/website-architecture.md`](https://github.com/albertngo/titan-agents-repo/blob/main-agents/methods/website-architecture.md).

## Homepage

A 1:1 rebuild of the **current** titanfloors.ca homepage, made with the
[ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template)
(MIT, licence in `LICENSE-cloner-template`).

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

## Product catalogue

Category pages (`/product-category/<category>/`), `/shop/`, product pages (`/product/<slug>/`)
and a wishlist (`/wishlist/`, quote request by email) read **Titan Desk's public catalogue view**
(`api.catalogue_public` in the titan-desk Supabase project) — never Airtable directly.

- What can appear on the site is decided by that view's tier table (titan-desk `db/README.md`):
  cost, MAP, supplier, notes and Lightspeed ids are not in it, so they cannot reach this site.
- Only products with a photo are listed (launch rule, 2026-10-23); a product appears as soon
  as Titan Desk syncs its first photo. Prices are retail, as on the live site.
- Pages refresh every 30 minutes, matching Titan Desk's sync.
- Setup: add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to this project's
  Vercel environment variables (copy them from the titan-desk web project), then redeploy.
  Until they're set, category pages show a "catalogue is being updated" note.
- Local preview with sample data (not real products):
  `CATALOGUE_FIXTURE=tests/fixtures/catalogue-SAMPLE-not-real.json npm run dev`.
- Code: data access in `src/lib/catalogue/`, pages in `src/app/product-category`, `src/app/product`,
  `src/app/shop`, UI in `src/components/sites/titanfloors/catalogue/`.

## Designing with AI

`.claude/skills/` carries vendored design skills (taste-skill) and 74 `DESIGN.md`
references from real sites. For page or section work, load `design-taste-frontend` (new)
or `redesign-existing-projects` (existing) and pick one to three references from
`design-md-references`. Borrow structure from them, never another brand; see
`.claude/skills/README.md`.

Brand assets in `public/brand/` (wordmark, Cysan + PT Serif fonts) are Titan's real 2024
brand guide (Social Estates), not placeholders.
