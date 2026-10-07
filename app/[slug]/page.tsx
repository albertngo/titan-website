// Flat root URL for every post: /<slug>/ (AEO Site Architecture Blueprint, decision 14
// in methods/content-engine-plan.md). Static at build time; an unknown slug is a 404,
// never a fallback render. Order on the page: direct answer → video → body → FAQ →
// pillar/sibling links → CTA → JSON-LD.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, postPath } from "@/lib/blog";
import { siteUrl } from "@/lib/site";
import DirectAnswer from "@/components/blog/DirectAnswer";
import VideoEmbed from "@/components/blog/VideoEmbed";
import Markdown from "@/components/blog/Markdown";
import Faq from "@/components/blog/Faq";
import PillarLinks from "@/components/blog/PillarLinks";
import CtaLink from "@/components/blog/CtaLink";
import JsonLd from "@/components/blog/JsonLd";

export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${siteUrl}${postPath(post.slug)}`;
  return {
    title: `${post.title} | Titan Flooring`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate ?? post.publishDate,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <main className="post">
      <article className="shell post-shell">
        <DirectAnswer title={post.title} snippet={post.snippet} publishDate={post.publishDate} updatedDate={post.updatedDate} />
        <VideoEmbed url={post.videoUrl} title={post.title} />
        <Markdown body={post.body} />
        <Faq items={post.faq} />
        <PillarLinks post={post} />
        <CtaLink cluster={post.cluster} material={post.material} />
      </article>
      <JsonLd post={post} />
    </main>
  );
}
