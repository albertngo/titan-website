// Types for lib/blog-schema.mjs (plain ESM so the build validator shares it).

export interface FaqItem {
  q: string;
  a: string;
}

export interface Legacy {
  wpId: number;
  importedAt: string;
}

export type Intent = "Informational" | "Commercial" | "Navigation" | "Transaction";
export type ContentType = "Pillar Page" | "Supporting Content";
export type ClusterSlug =
  | "basement-flooring"
  | "waterproof"
  | "vinyl-laminate"
  | "hardwood"
  | "installation-cost"
  | "installation-process"
  | "comparison"
  | "maintenance";

export interface Frontmatter {
  schema: "blog-mdx-1";
  blogId: string;
  notionPageId: string;
  title: string;
  slug: string;
  description: string;
  snippet: string;
  keyword: string;
  intent: Intent;
  cluster: ClusterSlug;
  material: string[];
  contentType: ContentType;
  pillar: string | null;
  siblings: string[];
  publishDate: string;
  updatedDate: string | null;
  videoUrl: string | null;
  faq: FaqItem[];
  legacy: Legacy | null;
}

export const SCHEMA: "blog-mdx-1";
export const CLUSTERS: Record<ClusterSlug, string>;
export const MATERIALS: readonly string[];
export const INTENTS: readonly string[];
export const CONTENT_TYPES: readonly string[];
export const RESERVED_SLUGS: readonly string[];
export const SLUG_RE: RegExp;
export const KEYS: readonly string[];

export function parsePostFile(text: string): { frontmatter: Frontmatter; body: string };
export function wordCount(s: string | null | undefined): number;
export function validateFrontmatter(fm: unknown, fileSlug?: string): string[];
export function validateBody(body: string): string[];
export function validatePostFile(
  text: string,
  fileSlug?: string,
): { problems: string[]; parsed: { frontmatter: Frontmatter; body: string } | null };
export function validateCollection(posts: Frontmatter[]): string[];
