import NoticeBody from "../news/NoticeBody";
import NoticeList, { formatPublishedDate } from "../news/NoticeList";

function PageShell({ title, lead, children }) {
  return (
    <div className="bg-grid min-h-[60vh]">
      <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-xs font-bold tracking-[0.28em] text-navy">TUAT SHOGI CLUB</p>
        <h1 className="mt-3 border-b border-navy/20 pb-5 font-mincho text-4xl font-bold tracking-[0.08em] text-sumi md:text-5xl">{title}</h1>
        {lead && <p className="mt-6 leading-8 text-ink/70">{lead}</p>}
        <div className="mt-12 space-y-12">{children}</div>
      </div>
    </div>
  );
}

function NoticeAttachment({ attachment }) {
  const responsiveSources = Object.entries(attachment.responsive ?? {}).filter(([, path]) => path);
  const image = (
    <img
      src={attachment.path}
      alt={attachment.alt}
      width={attachment.width}
      height={attachment.height}
      loading="lazy"
      decoding="async"
      className="h-auto w-full rounded-lg"
    />
  );
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-white p-2 shadow-[0_12px_35px_rgba(15,51,80,0.10)] md:p-3">
      {responsiveSources.length > 0 ? (
        <picture>
          {responsiveSources.map(([format, path]) => (
            <source key={format} type={`image/${format}`} srcSet={path} />
          ))}
          {image}
        </picture>
      ) : image}
    </figure>
  );
}

export default function NewsPage({ notices = [], notice }) {
  if (!notice) {
    return (
      <PageShell title="お知らせ一覧" lead="東京農工大学将棋部からのお知らせです。">
        <NoticeList notices={notices} />
      </PageShell>
    );
  }

  return (
    <PageShell title={notice.title}>
      <article>
        <time dateTime={notice.publishedAt} className="text-sm text-ink/60">
          {formatPublishedDate(notice.publishedAt)}
        </time>
        <div className="mt-8">
          <NoticeBody body={notice.body} />
        </div>
        {notice.linkUrl && (
          <p className="mt-10">
            <a
              href={notice.linkUrl}
              className="inline-flex min-h-11 items-center rounded-md border border-navy/30 px-5 py-3 font-bold text-navy hover:bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
              関連リンク
            </a>
          </p>
        )}
        {notice.attachments.length > 0 && (
          <section className="mt-12" aria-labelledby="notice-attachments-title">
            <h2 id="notice-attachments-title" className="font-mincho text-2xl font-bold text-sumi">添付画像</h2>
            <div className="mt-6 space-y-6">
              {notice.attachments.map((attachment) => (
                <NoticeAttachment key={attachment.id} attachment={attachment} />
              ))}
            </div>
          </section>
        )}
      </article>
      <p>
        <a href="/news.html" className="font-bold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
          お知らせ一覧へ戻る
        </a>
      </p>
    </PageShell>
  );
}
