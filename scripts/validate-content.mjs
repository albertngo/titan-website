#!/usr/bin/env node
// Build-time gate for content/blog/*.mdx (blog-mdx-1). Wired into `npm run build`, so
// a post that breaks the contract fails the Vercel check on its pull request before
// anyone opens the preview. Zero dependencies; shares every rule with the site's own
// loader through lib/blog-schema.mjs.
//
//   node scripts/validate-content.mjs            # every file under content/blog
//   node scripts/validate-content.mjs a.mdx b.mdx
//
// Exit 0 when every file passes, 1 otherwise (each problem on its own line).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { validateCollection, validatePostFile } from "../lib/blog-schema.mjs";

const root = resolve(new URL("..", import.meta.url).pathname);
const dir = join(root, "content", "blog");

function listFiles() {
  const args = process.argv.slice(2);
  if (args.length) return args.map((a) => resolve(a));
  try {
    if (!statSync(dir).isDirectory()) return [];
  } catch {
    return [];
  }
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((f) => join(dir, f));
}

const files = listFiles();
let failed = 0;
const fronts = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const fileSlug = basename(file).replace(/\.mdx$/, "");
  const { problems, parsed } = validatePostFile(text, fileSlug);
  if (problems.length) {
    failed += 1;
    for (const p of problems) console.error(`${basename(file)}: ${p}`);
  } else if (parsed) {
    fronts.push(parsed.frontmatter);
  }
}
if (!failed) {
  for (const p of validateCollection(fronts)) {
    failed += 1;
    console.error(`collection: ${p}`);
  }
}
if (failed) {
  console.error(`validate-content: ${failed} problem group(s) in ${files.length} file(s)`);
  process.exit(1);
}
console.log(`validate-content: ${files.length} post(s) ok`);
