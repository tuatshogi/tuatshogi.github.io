import { isSafeNoticeUrl } from "../../data/notices";

const urlPattern = /https?:\/\/[^\s<>"']+/g;
const trailingUrlPunctuation = /[.,!?;:、。！？；：)\]}]+$/;

function renderLine(line, lineIndex) {
  const parts = [];
  let cursor = 0;

  for (const match of line.matchAll(urlPattern)) {
    const start = match.index;
    const rawUrl = match[0];
    const punctuation = rawUrl.match(trailingUrlPunctuation)?.[0] ?? "";
    const url = punctuation ? rawUrl.slice(0, -punctuation.length) : rawUrl;
    if (start > cursor) parts.push(line.slice(cursor, start));
    if (!isSafeNoticeUrl(url)) {
      parts.push(rawUrl);
      cursor = start + rawUrl.length;
      continue;
    }
    parts.push(
      <a
        key={`${lineIndex}-${start}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded font-medium text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
      >
        {url}
        <span className="sr-only">（新しいタブで開く）</span>
      </a>,
    );
    if (punctuation) parts.push(punctuation);
    cursor = start + rawUrl.length;
  }

  if (cursor < line.length) parts.push(line.slice(cursor));
  return parts.length ? parts : [line];
}

export default function NoticeBody({ body }) {
  return (
    <div className="space-y-6 leading-8 text-ink/80">
      {body.split(/\n\s*\n/).map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex}>
          {paragraph.split("\n").map((line, lineIndex) => (
            <span key={lineIndex}>
              {renderLine(line, `${paragraphIndex}-${lineIndex}`)}
              {lineIndex < paragraph.split("\n").length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
