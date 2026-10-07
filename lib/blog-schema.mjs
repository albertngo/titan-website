// The blog-mdx-1 contract, as code. Mirrors
// titan-agents-repo/contracts/blog-mdx-schema.md and the cluster / slug tables in
// titan-agents-repo/platform-settings/content-engine.json — that repo is the source of
// truth; this file is hand-copied from it (same rule as lib/site.ts). Plain ESM with no
// imports so both the Next.js loader (lib/blog.ts) and the build-time validator
// (scripts/validate-content.mjs) run the same checks. A file this module rejects never
// reaches a Vercel preview: `npm run build` validates first.

export const SCHEMA = "blog-mdx-1";

// slug -> label; slug doubles as utm_campaign (content-engine.json -> clusters).
export const CLUSTERS = {
  "basement-flooring": "Basement Flooring",
  "waterproof": "Waterproof",
  "vinyl-laminate": "Vinyl Plank & Laminate",
  "hardwood": "Hardwood",
  "installation-cost": "Installation Cost & Pricing",
  "installation-process": "Installation Process",
  "comparison": "Comparison",
  "maintenance": "Maintenance & Care",
};

export const MATERIALS = ["Vinyl", "Laminate", "Engineered", "Solid", "Tile"];
export const INTENTS = ["Informational", "Commercial", "Navigation", "Transaction"];
export const CONTENT_TYPES = ["Pillar Page", "Supporting Content"];

// content-engine.json -> website. Flat root slugs share the namespace with every
// other top-level route, so a post may never take one of these.
export const RESERVED_SLUGS = ["blog", "about-us", "contact", "flooring-install", "stair-refinishing", "product-category"];
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_MAX = 70;
export const TITLE_MAX = 110;
export const DESCRIPTION_MAX = 160;
export const SNIPPET_WORDS = { min: 40, max: 60 };
export const FAQ_COUNT = { min: 3, max: 5 };
export const SIBLINGS_MAX = 6;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const YOUTUBE_RE = /^https:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[A-Za-z0-9_-]{6,}/;

export const KEYS = [
  "schema", "blogId", "notionPageId", "title", "slug", "description", "snippet", "keyword", "intent",
  "cluster", "material", "contentType", "pillar", "siblings", "publishDate", "updatedDate", "videoUrl",
  "faq", "legacy",
];

/** Split a post file into {frontmatter, body}. One key per line, every value JSON. */
export function parsePostFile(text) {
  if (!text.startsWith("---\n")) throw new Error("no frontmatter");
  const end = text.indexOf("\n---", 4);
  if (end < 0) throw new Error("unterminated frontmatter");
  const frontmatter = {};
  for (const line of text.slice(4, end).split("\n")) {
    if (!line.trim()) continue;
    const i = line.indexOf(":");
    if (i < 0) throw new Error(`frontmatter line without a colon: ${line}`);
    const key = line.slice(0, i).trim();
    const raw = line.slice(i + 1).trim();
    try {
      frontmatter[key] = JSON.parse(raw);
    } catch {
      throw new Error(`frontmatter value for ${key} is not JSON: ${raw}`);
    }
  }
  const body = text.slice(end + 4).replace(/^\n+/, "");
  return { frontmatter, body };
}

export function wordCount(s) {
  return String(s ?? "").trim().split(/\s+/).filter(Boolean).length;
}

const isStr = (v) => typeof v === "string";
const isNonEmpty = (v) => isStr(v) && v.trim().length > 0;

/**
 * Every rule of the contract's frontmatter table. Returns a list of problems
 * (empty = valid). `fileSlug` is the file name without `.mdx`, which must equal `slug`.
 */
export function validateFrontmatter(fm, fileSlug) {
  const p = [];
  if (!fm || typeof fm !== "object") return ["frontmatter is not an object"];
  for (const k of KEYS) if (!(k in fm)) p.push(`missing key ${k}`);
  for (const k of Object.keys(fm)) if (!KEYS.includes(k)) p.push(`unknown key ${k}`);
  if (fm.schema !== SCHEMA) p.push(`schema must be ${SCHEMA}`);
  if (!/^BP-\d+$/.test(String(fm.blogId))) p.push("blogId must be BP-<n>");
  if (!isNonEmpty(fm.notionPageId)) p.push("notionPageId is empty");
  if (!isNonEmpty(fm.title)) p.push("title is empty");
  else if (fm.title.length > TITLE_MAX) p.push(`title longer than ${TITLE_MAX}`);
  if (!isStr(fm.slug) || !SLUG_RE.test(fm.slug)) p.push("slug does not match ^[a-z0-9]+(?:-[a-z0-9]+)*$");
  else {
    if (fm.slug.length > SLUG_MAX) p.push(`slug longer than ${SLUG_MAX}`);
    if (RESERVED_SLUGS.includes(fm.slug)) p.push(`slug ${fm.slug} is reserved`);
    if (fileSlug !== undefined && fileSlug !== fm.slug) p.push(`file name ${fileSlug} != slug ${fm.slug}`);
  }
  if (!isNonEmpty(fm.description)) p.push("description is empty");
  else if (fm.description.length > DESCRIPTION_MAX) p.push(`description longer than ${DESCRIPTION_MAX}`);
  const sw = wordCount(fm.snippet);
  if (sw < SNIPPET_WORDS.min || sw > SNIPPET_WORDS.max) p.push(`snippet is ${sw} words, need ${SNIPPET_WORDS.min}-${SNIPPET_WORDS.max}`);
  if (!isNonEmpty(fm.keyword)) p.push("keyword is empty");
  if (!INTENTS.includes(fm.intent)) p.push(`intent must be one of ${INTENTS.join(" / ")}`);
  if (!(fm.cluster in CLUSTERS)) p.push(`cluster ${fm.cluster} is not one of the 8 slugs`);
  if (!Array.isArray(fm.material) || fm.material.some((m) => !MATERIALS.includes(m))) p.push("material must be a subset of " + MATERIALS.join(" / "));
  if (!CONTENT_TYPES.includes(fm.contentType)) p.push("contentType must be Pillar Page or Supporting Content");
  if (fm.pillar !== null && (!isStr(fm.pillar) || !SLUG_RE.test(fm.pillar))) p.push("pillar must be a slug or null");
  if (fm.pillar === null && fm.contentType !== "Pillar Page") {
    // flagged, not refused, while pillar_rules.required is false (content-engine.json)
  }
  if (fm.contentType === "Pillar Page" && fm.pillar !== null) p.push("a Pillar Page has no pillar");
  if (!Array.isArray(fm.siblings) || fm.siblings.length > SIBLINGS_MAX || fm.siblings.some((s) => !isStr(s) || !SLUG_RE.test(s))) p.push(`siblings must be 0-${SIBLINGS_MAX} slugs`);
  if (!isStr(fm.publishDate) || !DATE_RE.test(fm.publishDate)) p.push("publishDate must be YYYY-MM-DD");
  if (fm.updatedDate !== null && (!isStr(fm.updatedDate) || !DATE_RE.test(fm.updatedDate))) p.push("updatedDate must be YYYY-MM-DD or null");
  if (fm.videoUrl !== null && (!isStr(fm.videoUrl) || !YOUTUBE_RE.test(fm.videoUrl))) p.push("videoUrl must be a YouTube URL or null");
  if (!Array.isArray(fm.faq) || fm.faq.length < FAQ_COUNT.min || fm.faq.length > FAQ_COUNT.max) p.push(`faq must hold ${FAQ_COUNT.min}-${FAQ_COUNT.max} items`);
  else {
    fm.faq.forEach((f, i) => {
      if (!f || !isNonEmpty(f.q) || !f.q.trim().endsWith("?")) p.push(`faq[${i}].q must be a question ending with ?`);
      if (!f || !isNonEmpty(f.a)) p.push(`faq[${i}].a is empty`);
    });
  }
  if (fm.legacy !== null) {
    const ok = fm.legacy && typeof fm.legacy === "object" && Number.isInteger(fm.legacy.wpId) && DATE_RE.test(String(fm.legacy.importedAt));
    if (!ok) p.push("legacy must be null or {wpId: n, importedAt: YYYY-MM-DD}");
  }
  return p;
}

/** Body rules: no H1 (it lives in `title`), no `## FAQ` (it lives in `faq`), every H2 a question. */
export function validateBody(body) {
  const p = [];
  const lines = String(body ?? "").split("\n");
  let fence = false;
  for (const line of lines) {
    if (line.startsWith("```")) { fence = !fence; continue; }
    if (fence) continue;
    if (/^#\s/.test(line)) p.push(`body carries an H1: ${line.trim()}`);
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      const h = h2[1].trim();
      if (h.toLowerCase() === "faq") p.push("body carries a ## FAQ section; it belongs in faq[]");
      else if (!h.endsWith("?")) p.push(`H2 is not a question: ${h}`);
    }
  }
  if (wordCount(body) === 0) p.push("body is empty");
  return p;
}

/** Everything a file must satisfy to build. */
export function validatePostFile(text, fileSlug) {
  let parsed;
  try {
    parsed = parsePostFile(text);
  } catch (e) {
    return { problems: [e instanceof Error ? e.message : String(e)], parsed: null };
  }
  const problems = [...validateFrontmatter(parsed.frontmatter, fileSlug), ...validateBody(parsed.body)];
  return { problems, parsed };
}

/** Cross-file rules: unique slugs and blogIds, pillar/sibling links that resolve. */
export function validateCollection(posts) {
  const p = [];
  const bySlug = new Map();
  const byId = new Map();
  for (const post of posts) {
    if (bySlug.has(post.slug)) p.push(`duplicate slug ${post.slug}`);
    bySlug.set(post.slug, post);
    if (byId.has(post.blogId)) p.push(`duplicate blogId ${post.blogId} (${post.slug})`);
    byId.set(post.blogId, post);
  }
  for (const post of posts) {
    if (post.pillar !== null) {
      const target = bySlug.get(post.pillar);
      if (!target) p.push(`${post.slug}: pillar ${post.pillar} does not exist`);
      else if (target.contentType !== "Pillar Page") p.push(`${post.slug}: pillar ${post.pillar} is not a Pillar Page`);
    }
    for (const s of post.siblings) if (!bySlug.has(s)) p.push(`${post.slug}: sibling ${s} does not exist`);
  }
  return p;
}
