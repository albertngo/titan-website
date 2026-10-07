// The Markdown subset a post body may use (contracts/blog-mdx-schema.md, "Body"):
// ## / ### headings, paragraphs, - lists, 1. lists, **bold**, *italic*, [text](url),
// pipe tables and > quotes. Anything else is rendered as plain paragraph text, never as
// HTML — the body is data from a reviewed file, and the renderer emits only elements it
// knows. Pure functions; components/blog/Markdown.tsx turns the blocks into JSX.

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "strong"; children: Inline[] }
  | { kind: "em"; children: Inline[] }
  | { kind: "link"; href: string; children: Inline[] };

export type Block =
  | { kind: "heading"; level: 2 | 3; text: string; id: string }
  | { kind: "paragraph"; inlines: Inline[] }
  | { kind: "list"; ordered: boolean; items: Inline[][] }
  | { kind: "quote"; inlines: Inline[] }
  | { kind: "table"; header: Inline[][]; rows: Inline[][][] };

export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

const SAFE_HREF = /^(https?:\/\/|\/|mailto:|tel:|#)/;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let rest = text;
  const push = (t: string) => {
    if (!t) return;
    const last = out[out.length - 1];
    if (last && last.kind === "text") last.text += t;
    else out.push({ kind: "text", text: t });
  };
  while (rest.length) {
    const link = rest.match(/^\[([^\]]+)\]\(([^)\s]+)\)/);
    if (link) {
      const href = SAFE_HREF.test(link[2]) ? link[2] : "#";
      out.push({ kind: "link", href, children: parseInline(link[1]) });
      rest = rest.slice(link[0].length);
      continue;
    }
    const strong = rest.match(/^\*\*([^*]+)\*\*/);
    if (strong) {
      out.push({ kind: "strong", children: parseInline(strong[1]) });
      rest = rest.slice(strong[0].length);
      continue;
    }
    const em = rest.match(/^\*([^*]+)\*/);
    if (em) {
      out.push({ kind: "em", children: parseInline(em[1]) });
      rest = rest.slice(em[0].length);
      continue;
    }
    const next = rest.slice(1).search(/[[*]/);
    if (next < 0) {
      push(rest);
      rest = "";
    } else {
      push(rest.slice(0, next + 1));
      rest = rest.slice(next + 1);
    }
  }
  return out;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

const isSeparator = (line: string) => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(line.trim());

export function parseBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  const flushParagraph = (buf: string[]) => {
    const text = buf.join(" ").trim();
    if (text) blocks.push({ kind: "paragraph", inlines: parseInline(text) });
  };
  let para: string[] = [];
  while (i < lines.length) {
    const line = lines[i];
    const h = line.match(/^(##|###)\s+(.*)$/);
    if (h) {
      flushParagraph(para);
      para = [];
      const text = h[2].trim();
      blocks.push({ kind: "heading", level: h[1].length === 2 ? 2 : 3, text, id: headingId(text) });
      i += 1;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      flushParagraph(para);
      para = [];
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items: Inline[][] = [];
      while (i < lines.length && (ordered ? /^\s*\d+[.)]\s+/.test(lines[i]) : /^\s*[-*]\s+/.test(lines[i]))) {
        items.push(parseInline(lines[i].replace(ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/, "").trim()));
        i += 1;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }
    if (/^>\s?/.test(line)) {
      flushParagraph(para);
      para = [];
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ kind: "quote", inlines: parseInline(buf.join(" ").trim()) });
      continue;
    }
    if (line.trim().startsWith("|") && i + 1 < lines.length && isSeparator(lines[i + 1])) {
      flushParagraph(para);
      para = [];
      const header = splitRow(line).map(parseInline);
      i += 2;
      const rows: Inline[][][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]).map(parseInline));
        i += 1;
      }
      blocks.push({ kind: "table", header, rows });
      continue;
    }
    if (!line.trim()) {
      flushParagraph(para);
      para = [];
      i += 1;
      continue;
    }
    para.push(line.trim());
    i += 1;
  }
  flushParagraph(para);
  return blocks;
}

/** Plain text of the body, for word counts and reading time. */
export function plainText(body: string): string {
  return body
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_>|`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
