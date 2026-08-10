export function formatPublishedDate(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(new Date(value));
}

export default function NoticeList({ notices = [], limit, showPublishedDate = true }) {
  const visibleNotices = typeof limit === "number" ? notices.slice(0, limit) : notices;

  if (visibleNotices.length === 0) {
    return <p className="rounded-xl border border-dashed border-line bg-white/60 px-5 py-8 text-center text-ink/65">現在、お知らせはありません。</p>;
  }

  return (
    <ul className="divide-y divide-line rounded-xl border border-line bg-white">
      {visibleNotices.map((notice) => (
        <li key={notice.id} className="px-5 py-5 md:flex md:items-center md:gap-6 md:px-6">
          {showPublishedDate && (
            <time dateTime={notice.publishedAt} className="shrink-0 text-sm text-ink/60">
              {formatPublishedDate(notice.publishedAt)}
            </time>
          )}
          <a
            href={`/news/${notice.id}.html`}
            className="mt-2 block flex-1 font-bold text-sumi underline decoration-transparent underline-offset-4 hover:decoration-sumi/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy md:mt-0"
          >
            {notice.title}
          </a>
          <a
            href={`/news/${notice.id}.html`}
            className="mt-3 inline-flex min-h-11 items-center rounded-md border border-navy/30 px-4 py-2 text-sm font-bold text-navy hover:bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy md:mt-0"
          >
            詳細を見る
          </a>
        </li>
      ))}
    </ul>
  );
}
