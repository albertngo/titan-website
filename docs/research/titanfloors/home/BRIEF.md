# titanfloors.ca homepage — clone brief (captured 2026-10-22)

Source `https://titanfloors.ca/` → local `/` (`src/app/page.tsx` → `src/components/sites/titanfloors/`).
Evidence in this folder: full-page and per-section screenshots (desktop 1440, mobile 390),
`desktop.json` / `mobile.json` (computed styles, positions, images), the live `page.html`, and the
Elementor stylesheets in `css/` (`post-5` is the global kit: colours, type scale, breakpoints).

## System
- Colours: navy `#293895`, orange `#CF6335`, cream `#F3F1E7`, sky `#CFE2EE`, peach `#F3E0D8`, steel `#97B1C7`.
- Fonts: Cysan (display), PT Serif 400/700, Inter variable — the live files, self-hosted via `next/font/local`.
- Breakpoints: 1366 / 1024 / 767 (Elementor's). Page width 1350, radius 30 (20 on mobile),
  card border `1px #97B1C7`, shadow `2px 2px 5px rgba(0,0,0,.25)`.
- Motion: most blocks fade in on scroll (1.25s; hero and install cards 2s); steps stagger 0/300/600ms;
  review carousel autoplays every 5s, 500ms slide, pauses on hover. Reduced-motion turns all of it off.

## Deliberate differences from the live page
- **Heading levels.** Visuals unchanged; the one H1 is kept, section titles became H2 (live used P/H3/H4/H5).
- **Contact form.** Live posts to WordPress; here SUBMIT opens the visitor's email app pre-filled
  (no form backend yet — a GHL embed is the planned replacement).
- **Featured blog posts.** Both live posts and their images return 404. Layout and text are kept;
  READ MORE points to `/blog/` on the live site; the image column stays empty, as it renders live.
- **About-section background photo** (`1-2.png`) is fully covered by a cream overlay live, so it isn't shipped.

## Not yet rebuilt (links point back to the live site)
Product categories, shop, blog, about, contact, install pages, wishlist and search.

## Copied as-is but worth fixing
- "Shop by Category" tiles aren't links on the live site.
- Footer "All Products" on the live site goes to a single product page (`?page_id=836`); here it goes to `/shop/`.
- "MIssissauga" typo in the contact block address.
