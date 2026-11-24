import NoticeList from "../news/NoticeList";

export default function NewsSection({ notices = [] }) {
  return (
    <section
      className="home-screen-section home-news-section min-h-[max(780px,calc(100svh-var(--site-header-height,80px)))] relative border-y border-line/70"
      aria-labelledby="news-title"
      data-stagger-group
    >
      <div className="home-news-slice-overlay" data-news-slice-overlay aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} style={{ top: `${index * 12.5}%`, "--slice-delay": `${index * 55}ms` }} />
        ))}
      </div>
      <div className="mx-auto w-full max-w-site px-5 md:px-8 lg:px-12">
        <header className="flex flex-wrap items-end justify-between gap-4" data-stagger-item>
          <h2 id="news-title" className="font-mincho text-3xl font-bold tracking-[0.06em] text-sumi md:text-4xl">お知らせ</h2>
          <a href="/news.html" className="home-news-more-link font-mincho font-bold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
            もっとみる
          </a>
        </header>
        <div className="home-news-content mt-8" data-news-carousel data-stagger-item>
          <NoticeList notices={notices} showPublishedDate layout="carousel" />
          <div className="home-news-pagination mt-4 flex items-center justify-between gap-6" aria-label="お知らせのページ操作">
            <div className="flex min-h-10 items-center gap-2" data-news-page-indicators aria-label="お知らせのページ">
              <span className="home-news-indicator home-news-indicator--current" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" data-news-direction="-1" aria-label="前のお知らせ" aria-controls="home-news-track" disabled className="home-news-control inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink/65 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy disabled:cursor-default disabled:opacity-45">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" /></svg>
              </button>
              <button type="button" data-news-direction="1" aria-label="次のお知らせ" aria-controls="home-news-track" disabled className="home-news-control inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink/65 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy disabled:cursor-default disabled:opacity-45">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
