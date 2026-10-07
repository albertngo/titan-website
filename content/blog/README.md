# content/blog

One `<slug>.mdx` per published-or-approved post, written only by the content engine in
`titan-agents-repo` (`/blog-publish` → `scripts/blog_render.py` → a pull request on
branch `blog/<slug>`). Contract: `titan-agents-repo/contracts/blog-mdx-schema.md`,
enforced here by `lib/blog-schema.mjs` at build time (`npm run build` runs
`scripts/validate-content.mjs` first).

The file name is the URL: `content/blog/is-laminate-flooring-waterproof.mdx` serves at
`/is-laminate-flooring-waterproof/`. Flat, no `/blog/` prefix — hierarchy lives in the
`pillar` / `siblings` links, never in the path.

Edit a post by editing this file in a PR; from publish onward the MDX is canonical and
Notion is the draft history.
