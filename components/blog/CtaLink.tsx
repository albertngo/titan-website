// Every call to action on a post carries the UTM triple that the feedback loop reads:
// utm_source=blog, utm_medium=organic, utm_campaign=<topic-cluster slug>. The campaign
// value is the cluster, never the post, so won deals roll up per cluster
// (titan-agents-repo/methods/content-engine.md, "The loop"). A phone link cannot carry
// a query string, so the phone CTA stays plain.

import { nap } from "@/lib/site";
import type { ClusterSlug } from "@/lib/blog";

export function utmHref(path: string, cluster: ClusterSlug, source = "blog", medium = "organic"): string {
  const q = new URLSearchParams({ utm_source: source, utm_medium: medium, utm_campaign: cluster });
  return `${path}${path.includes("?") ? "&" : "?"}${q.toString()}`;
}

export default function CtaLink({ cluster, material }: { cluster: ClusterSlug; material: string[] }) {
  const what = material.length ? material.join(" and ").toLowerCase() : "flooring";
  return (
    <aside className="post-cta">
      <h2>Thinking about {what} for your home?</h2>
      <p>
        Come see it in the showroom or send us your room sizes — we&apos;ll give you a straight answer and a
        free estimate.
      </p>
      <div className="hero-actions">
        <a className="btn primary" href={utmHref("/contact/", cluster)}>
          Get a free estimate
        </a>
        <a className="btn secondary" href={nap.phoneHref}>
          Call {nap.phone}
        </a>
      </div>
    </aside>
  );
}
