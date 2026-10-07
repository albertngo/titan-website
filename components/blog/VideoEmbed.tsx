// YouTube only (content-engine.json -> website.video_embed; Shorts count). Rendered
// directly below the direct answer, per the AEO structure. Null URL renders nothing.

export function youtubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

export default function VideoEmbed({ url, title }: { url: string | null; title: string }) {
  const id = youtubeId(url);
  if (!id) return null;
  return (
    <div className="video-embed">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
