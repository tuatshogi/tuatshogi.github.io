import { siteConfig } from "../../data/siteConfig";
import heroArtwork from "../../assets/shogi-pieces-hero.png";

const highlights = [
  { label: "活動日", value: "毎週金曜日" },
  { label: "見学", value: "初心者歓迎" },
  { label: "部費", value: "ありません" },
];

export default function HeroSection() {
  return (
    <section
      className="home-screen-section relative isolate flex min-h-[calc(100svh-72px)] flex-col overflow-hidden border-b border-[#E4E7E2]/60 bg-[#F9F9F8] md:min-h-[calc(100svh-80px)]"
      aria-labelledby="hero-title"
    >
      <img
        src={heroArtwork}
        alt=""
        aria-hidden="true"
        className="home-hero-art pointer-events-none absolute inset-0 -z-20 h-full w-full select-none object-cover"
        fetchPriority="high"
      />
      <div className="home-hero-overlay pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="home-hero-decoration pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden="true">
        <svg className="home-hero-field" viewBox="0 0 760 820" preserveAspectRatio="none" fill="none">
          <g className="home-hero-board-grid">
            {Array.from({ length: 10 }, (_, index) => {
              const progress = index / 9;
              const topX = 145 + 472 * progress;
              const bottomX = 42 + 676 * progress;
              const leftX = 145 - 103 * progress;
              const rightX = 617 + 101 * progress;
              const y = 266 + 480 * progress;
              const lineClass = index % 3 === 0
                ? "home-hero-field__board-line home-hero-field__board-line--gold"
                : "home-hero-field__board-line";

              return (
                <g key={index}>
                  <path className={lineClass} d={`M${topX} 266 L${bottomX} 746`} />
                  <path className={lineClass} d={`M${leftX} ${y} L${rightX} ${y - 16 * progress}`} />
                </g>
              );
            })}
          </g>
        </svg>
        <div className="home-hero-move absolute left-8 top-[2%]">
          <svg className="h-full w-full" viewBox="0 0 520 420" fill="none">
            <path className="home-hero-move__brush" d="M48 334C129 310 170 267 214 203C256 141 318 112 405 82" />
            <path className="home-hero-move__trail" d="M48 334C129 310 170 267 214 203C256 141 318 112 405 82" />
            <path className="home-hero-move__echo" d="M74 368C154 342 194 298 238 235C279 177 335 151 428 121" />
            <circle className="home-hero-move__node" cx="48" cy="334" r="4" />
            <circle className="home-hero-move__accent home-hero-move__accent--soft" cx="145" cy="187" r="18" />
            <circle className="home-hero-move__accent home-hero-move__accent--gold" cx="170" cy="163" r="5" />
            <circle className="home-hero-move__accent home-hero-move__accent--soft" cx="338" cy="214" r="12" />
            <circle className="home-hero-move__accent home-hero-move__accent--gold" cx="359" cy="190" r="3" />
            <ellipse className="home-hero-move__accent home-hero-move__accent--ink" cx="440" cy="270" rx="14" ry="8" />
            <circle className="home-hero-move__accent home-hero-move__accent--gold" cx="464" cy="250" r="2" />
          </svg>
        </div>
        <span className="home-hero-speck home-hero-speck--a" />
        <span className="home-hero-speck home-hero-speck--b" />
        <span className="home-hero-speck home-hero-speck--c" />
        <span className="home-hero-speck home-hero-speck--d" />
        <span className="home-hero-speck home-hero-speck--e" />
        <span className="home-hero-speck home-hero-speck--f" />
        <span className="home-hero-speck home-hero-speck--g" />
        <span className="home-hero-speck home-hero-speck--h" />
        <span className="home-hero-speck home-hero-speck--i" />
        <span className="home-hero-speck home-hero-speck--j" />
        <span className="home-hero-speck home-hero-speck--k" />
        <span className="home-hero-speck home-hero-speck--l" />
        <span className="home-hero-speck home-hero-speck--m" />
        <span className="home-hero-speck home-hero-speck--n" />
        <span className="home-hero-speck home-hero-speck--o" />
        <span className="home-hero-speck home-hero-speck--p" />
        <span className="home-hero-speck home-hero-speck--q" />
        <span className="home-hero-speck home-hero-speck--r" />
        <span className="home-hero-speck home-hero-speck--s" />
        <span className="home-hero-speck home-hero-speck--t" />
        <span className="home-hero-speck home-hero-speck--u" />
        <span className="home-hero-speck home-hero-speck--v" />
      </div>

      <div className="relative z-10 flex w-full flex-1 items-center px-4 py-12 md:items-end md:px-6 md:pt-16 md:pb-10 lg:px-8 lg:pt-20 lg:pb-12">
        <div className="home-hero-copy w-full max-w-[720px]">
          <h1
            id="hero-title"
            className="hero-club-name text-[clamp(2rem,5.4vw,4.5rem)] leading-[1.2] tracking-[0.04em] text-[#112840]"
          >
            {siteConfig.clubName}
          </h1>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={siteConfig.cta.visitDmHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#112840] px-7 py-3.5 font-bold text-white shadow-[0_5px_16px_-5px_rgba(17,40,64,0.35)] transition duration-200 hero-cta-button hover:bg-[#1A3B5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4 motion-reduce:transform-none motion-reduce:transition-none"
            >
              Twitter（現X）
              <span aria-hidden="true">↗</span>
              <span className="sr-only">（新しいタブで開く）</span>
            </a>
            <a
              href={siteConfig.cta.scheduleHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#112840]/20 bg-white px-7 py-3.5 font-bold text-[#112840] shadow-sm transition duration-200 hero-cta-button hover:bg-[#F3F4F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4 motion-reduce:transform-none motion-reduce:transition-none"
            >
              活動紹介を見る
            </a>
          </div>

          <dl className="mt-8 grid max-w-[510px] grid-cols-3 border-t border-[#112840]/15 pt-4">
            {highlights.map((item, index) => (
              <div
                key={item.label}
                className={`min-w-0 px-3 first:pl-0 ${index > 0 ? "border-l border-[#112840]/15" : ""}`}
              >
                <dt className="text-xs font-medium text-[#626B77]">{item.label}</dt>
                <dd className="mt-1 font-mincho text-sm font-bold leading-6 text-[#112840] sm:text-base">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
