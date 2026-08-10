import NoticeList from "../news/NoticeList";

export default function NewsSection({ notices = [] }) {
  return (
    <section className="relative border-y border-line/70 bg-[#f1f4f1] py-16 md:py-20" aria-labelledby="news-title">
      <div className="mx-auto max-w-site px-5 md:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="news-title" className="font-mincho text-3xl font-bold tracking-[0.06em] text-sumi md:text-4xl">お知らせ</h2>
          <a href="/news.html" className="font-bold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
            もっとみる
          </a>
        </div>
        <div className="mt-8">
          <NoticeList notices={notices} limit={3} showPublishedDate={false} />
        </div>
      </div>
    </section>
  );
}
