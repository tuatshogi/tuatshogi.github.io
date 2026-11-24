import { noticeHref } from "../../data/notices";

export function formatPublishedDate(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(new Date(value));
}

function formatCardDate(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  }).format(new Date(value)).replaceAll("/", ".");
}

export default function NoticeList({ notices = [], limit, showPublishedDate = true, layout = "list" }) {
  const visibleNotices = typeof limit === "number" ? notices.slice(0, limit) : notices;
  const isCardLayout = layout === "cards";
  const isCarouselLayout = layout === "carousel";
  const syncAttributes = {
    "data-cms-notice-list": "",
    "data-limit": typeof limit === "number" ? String(limit) : "",
    "data-show-published-date": String(showPublishedDate),
    "data-layout": layout,
    ...(isCarouselLayout ? { id: "home-news-track", tabIndex: 0, "aria-label": "お知らせ" } : {}),
  };

  if (visibleNotices.length === 0) {
    if (isCarouselLayout) {
      return (
        <ul {...syncAttributes} className="home-news-track">
          <li className="home-news-empty-slide">
            <p className="home-news-empty">現在、お知らせはありません。</p>
          </li>
        </ul>
      );
    }

    const emptyClassName = isCardLayout
      ? "rounded-xl border border-dashed border-[#C4C6CE] bg-white/70 px-5 py-8 text-center text-[#626B77]"
      : "rounded-xl border border-dashed border-line bg-white/60 px-5 py-8 text-center text-ink/65";
    return <p {...syncAttributes} className={emptyClassName}>現在、お知らせはありません。</p>;
  }

  if (isCardLayout || isCarouselLayout) {
    return (
      <ul {...syncAttributes} className={isCarouselLayout ? "home-news-track" : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"}>
        {visibleNotices.map((notice) => (
          <li key={notice.id} className={isCarouselLayout ? "home-news-slide" : "min-w-0"}>
            <a
              href={noticeHref(notice.id)}
              className="group flex h-full min-h-[clamp(172px,42svh,360px)] flex-col rounded-xl border border-[#E4E7E2] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(17,40,64,0.05)] transition-[border-radius,transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:rounded-2xl hover:border-[#D99B52] hover:shadow-[0_10px_24px_-12px_rgba(17,40,64,0.22)] focus-visible:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#F3F4F1] px-2.5 py-1 text-[11px] font-semibold leading-4 text-[#112840]">お知らせ</span>
                {showPublishedDate && (
                  <time dateTime={notice.publishedAt} className="shrink-0 text-xs text-[#626B77]">
                    {formatCardDate(notice.publishedAt)}
                  </time>
                )}
              </div>
              <h3 className="mt-4 flex-1 font-mincho text-base font-bold leading-7 text-[#112840] transition-colors group-hover:text-[#85530E]">
                {notice.title}
              </h3>
              <span aria-hidden="true" className="mt-3 self-end text-lg text-[#626B77] transition-transform group-hover:translate-x-1 group-hover:text-[#85530E]">→</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul {...syncAttributes} className="divide-y divide-line rounded-xl border border-line bg-white">
      {visibleNotices.map((notice) => (
        <li key={notice.id} className="px-5 py-5 md:flex md:items-center md:gap-6 md:px-6">
          {showPublishedDate && (
            <time dateTime={notice.publishedAt} className="shrink-0 text-sm text-ink/60">
              {formatPublishedDate(notice.publishedAt)}
            </time>
          )}
          <a
            href={noticeHref(notice.id)}
            className="mt-2 block flex-1 font-bold text-sumi underline decoration-transparent underline-offset-4 hover:decoration-sumi/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy md:mt-0"
          >
            {notice.title}
          </a>
          <a
            href={noticeHref(notice.id)}
            className="mt-3 inline-flex min-h-11 items-center rounded-md border border-navy/30 px-4 py-2 text-sm font-bold text-navy hover:bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy md:mt-0"
          >
            詳細を見る
          </a>
        </li>
      ))}
    </ul>
  );
}
