// Pillar-and-spoke navigation rendered from frontmatter (AEO Site Architecture
// Blueprint: hierarchy lives in links, never in the URL). A spoke shows one up-link and
// its siblings; a pillar lists its children, so adding a spoke never edits the pillar.

import { clusterLabel, getPillar, getPillarChildren, getSiblings, postPath, type Post } from "@/lib/blog";

export default function PillarLinks({ post }: { post: Post }) {
  const pillar = getPillar(post);
  const related = post.contentType === "Pillar Page" ? getPillarChildren(post.slug) : getSiblings(post);
  if (!pillar && !related.length) return null;
  return (
    <nav className="post-links" aria-label="Related guides">
      {pillar ? (
        <p className="post-links-up">
          Part of our guide: <a href={postPath(pillar.slug)}>{pillar.title}</a>
        </p>
      ) : null}
      {related.length ? (
        <>
          <h2>{post.contentType === "Pillar Page" ? "In this guide" : `More on ${clusterLabel(post.cluster)}`}</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <a href={postPath(r.slug)}>{r.title}</a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </nav>
  );
}
