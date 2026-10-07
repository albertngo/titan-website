// The AEO direct-answer block: the question as the H1, then the 40–60-word answer
// (Albert's "AEO Blog Post Structure"). A reader, or an answer engine, can stop here.

export default function DirectAnswer({ title, snippet, publishDate, updatedDate }: {
  title: string;
  snippet: string;
  publishDate: string;
  updatedDate: string | null;
}) {
  return (
    <header className="post-head">
      <h1 className="post-title">{title}</h1>
      <p className="direct-answer">{snippet}</p>
      <p className="post-meta">
        <time dateTime={publishDate}>Published {publishDate}</time>
        {updatedDate ? (
          <>
            {" · "}
            <time dateTime={updatedDate}>Updated {updatedDate}</time>
          </>
        ) : null}
      </p>
    </header>
  );
}
