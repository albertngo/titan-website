// One <script type="application/ld+json"> per post with a @graph of Article, FAQPage,
// VideoObject (when videoUrl) and BreadcrumbList (Home › Blog › Pillar › Post). The
// publisher is Titan's NAP from lib/site.ts. FAQPage rich results are restricted by
// Google; this serves answer engines, not SERP stars (methods/content-engine.md).

import { nap, siteUrl } from "@/lib/site";
import { clusterLabel, getPillar, postPath, type Post } from "@/lib/blog";
import { youtubeId } from "./VideoEmbed";

export function buildGraph(post: Post) {
  const url = `${siteUrl}${postPath(post.slug)}`;
  const publisher = {
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: nap.name,
    telephone: nap.phone,
    email: nap.email,
    address: { "@type": "PostalAddress", streetAddress: nap.address },
    url: siteUrl,
  };
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      datePublished: post.publishDate,
      dateModified: post.updatedDate ?? post.publishDate,
      about: clusterLabel(post.cluster),
      keywords: post.keyword,
      mainEntityOfPage: url,
      inLanguage: "en-CA",
      author: { "@type": "Organization", name: nap.name },
      publisher,
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  const vid = youtubeId(post.videoUrl);
  if (vid && post.videoUrl) {
    graph.push({
      "@type": "VideoObject",
      "@id": `${url}#video`,
      name: post.title,
      description: post.snippet,
      embedUrl: `https://www.youtube-nocookie.com/embed/${vid}`,
      contentUrl: post.videoUrl,
      thumbnailUrl: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
      uploadDate: post.publishDate,
    });
  }
  const pillar = getPillar(post);
  const crumbs = [
    { name: "Home", item: `${siteUrl}/` },
    { name: "Blog", item: `${siteUrl}/blog/` },
    ...(pillar ? [{ name: pillar.title, item: `${siteUrl}${postPath(pillar.slug)}` }] : []),
    { name: post.title, item: url },
  ];
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  });
  return { "@context": "https://schema.org", "@graph": graph };
}

export default function JsonLd({ post }: { post: Post }) {
  const json = JSON.stringify(buildGraph(post)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
