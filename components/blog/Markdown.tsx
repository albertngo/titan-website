import { parseBlocks, type Block, type Inline } from "@/lib/markdown";

function Inlines({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.kind) {
          case "text":
            return <span key={i}>{n.text}</span>;
          case "strong":
            return (
              <strong key={i}>
                <Inlines nodes={n.children} />
              </strong>
            );
          case "em":
            return (
              <em key={i}>
                <Inlines nodes={n.children} />
              </em>
            );
          case "link": {
            const external = /^https?:\/\//.test(n.href);
            return (
              <a key={i} href={n.href} rel={external ? "noopener" : undefined} target={external ? "_blank" : undefined}>
                <Inlines nodes={n.children} />
              </a>
            );
          }
        }
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "heading":
      return block.level === 2 ? <h2 id={block.id}>{block.text}</h2> : <h3 id={block.id}>{block.text}</h3>;
    case "paragraph":
      return (
        <p>
          <Inlines nodes={block.inlines} />
        </p>
      );
    case "list": {
      const items = block.items.map((it, i) => (
        <li key={i}>
          <Inlines nodes={it} />
        </li>
      ));
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case "quote":
      return (
        <blockquote>
          <p>
            <Inlines nodes={block.inlines} />
          </p>
        </blockquote>
      );
    case "table":
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {block.header.map((c, i) => (
                  <th key={i}>
                    <Inlines nodes={c} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td key={ci}>
                      <Inlines nodes={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** Renders a post body (the contract's Markdown subset) with no HTML passthrough. */
export default function Markdown({ body }: { body: string }) {
  const blocks = parseBlocks(body);
  return (
    <div className="post-body">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}
