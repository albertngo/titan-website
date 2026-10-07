// The blog index: every post grouped by topic cluster, pillars first. The nav already
// linked /blog/ before this page existed.

import type { Metadata } from "next";
import { getPostsByCluster, postPath } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Flooring guides & answers | Titan Flooring",
  description:
    "Straight answers to the flooring questions Mississauga and GTA homeowners ask us most: cost, waterproofing, basements, hardwood vs vinyl, care and installation.",
  alternates: { canonical: `${siteUrl}/blog/` },
};

export default function BlogIndex() {
  const groups = getPostsByCluster();
  return (
    <main>
      <section className="hero">
        <div className="shell">
          <span className="eyebrow">Flooring guides</span>
          <h1 className="hero-title">Answers from the showroom floor</h1>
          <p className="hero-sub">The questions GTA homeowners ask us, answered in plain English.</p>
        </div>
      </section>
      {groups.length === 0 ? (
        <section>
          <div className="shell">
            <p>Our first guides are on the way. In the meantime, call us or drop by the showroom.</p>
          </div>
        </section>
      ) : (
        groups.map((g) => (
          <section key={g.slug} id={g.slug}>
            <div className="shell">
              <div className="section-head">
                <h2>{g.label}</h2>
              </div>
              <ul className="post-list">
                {g.posts.map((p) => (
                  <li key={p.slug} className={p.contentType === "Pillar Page" ? "pillar" : undefined}>
                    <a href={postPath(p.slug)}>{p.title}</a>
                    <p>{p.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))
      )}
    </main>
  );
}
