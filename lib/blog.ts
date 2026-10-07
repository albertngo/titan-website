// Server-only loader for content/blog/*.mdx (blog-mdx-1). Reads the directory once per
// build, validates every file with the same rules the build gate ran, and exposes the
// handful of queries the pages need. No network, no platform: the site never reads
// Notion or anything live (methods/website-architecture.md).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  CLUSTERS,
  parsePostFile,
  validateBody,
  validateFrontmatter,
  type ClusterSlug,
  type Frontmatter,
} from "./blog-schema.mjs";

export type { Frontmatter, FaqItem, ClusterSlug } from "./blog-schema.mjs";

export interface Post extends Frontmatter {
  body: string;
}

const CONTENT_DIR = join(process.cwd(), "content", "blog");

let cache: Post[] | null = null;

function load(): Post[] {
  if (cache) return cache;
  let files: string[] = [];
  try {
    if (statSync(CONTENT_DIR).isDirectory()) files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  } catch {
    files = [];
  }
  const posts: Post[] = [];
  for (const file of files.sort()) {
    const text = readFileSync(join(CONTENT_DIR, file), "utf8");
    const fileSlug = file.replace(/\.mdx$/, "");
    const { frontmatter, body } = parsePostFile(text);
    const problems = [...validateFrontmatter(frontmatter, fileSlug), ...validateBody(body)];
    if (problems.length) throw new Error(`content/blog/${file}: ${problems.join("; ")}`);
    posts.push({ ...frontmatter, body });
  }
  posts.sort((a, b) => (a.publishDate < b.publishDate ? 1 : a.publishDate > b.publishDate ? -1 : a.slug.localeCompare(b.slug)));
  cache = posts;
  return posts;
}

export function getAllPosts(): Post[] {
  return load();
}

export function getPost(slug: string): Post | undefined {
  return load().find((p) => p.slug === slug);
}

/** Spokes of a pillar, newest first. Adding a spoke never edits the pillar file. */
export function getPillarChildren(pillarSlug: string): Post[] {
  return load().filter((p) => p.pillar === pillarSlug);
}

/** The posts a spoke links sideways to: its own `siblings`, else the pillar's other spokes. */
export function getSiblings(post: Post): Post[] {
  const all = load();
  const named = post.siblings.map((s) => all.find((p) => p.slug === s)).filter((p): p is Post => Boolean(p));
  if (named.length) return named;
  if (post.pillar) return getPillarChildren(post.pillar).filter((p) => p.slug !== post.slug).slice(0, 6);
  return [];
}

export function getPillar(post: Post): Post | undefined {
  return post.pillar ? getPost(post.pillar) : undefined;
}

export function clusterLabel(slug: ClusterSlug): string {
  return CLUSTERS[slug] ?? slug;
}

/** Posts grouped by cluster, pillars first within each group, in the registry's cluster order. */
export function getPostsByCluster(): { slug: ClusterSlug; label: string; posts: Post[] }[] {
  const all = load();
  return (Object.keys(CLUSTERS) as ClusterSlug[])
    .map((slug) => ({
      slug,
      label: CLUSTERS[slug],
      posts: all
        .filter((p) => p.cluster === slug)
        .sort((a, b) => Number(b.contentType === "Pillar Page") - Number(a.contentType === "Pillar Page")),
    }))
    .filter((g) => g.posts.length > 0);
}

export function postPath(slug: string): string {
  return `/${slug}/`;
}
