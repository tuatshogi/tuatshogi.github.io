import { siteConfig } from "../../data/siteConfig";

function BoardVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden="true">
      <div className="absolute inset-[8%] rotate-2 rounded-sm border border-navy/20 bg-[#e8d9b7] shadow-[0_30px_70px_rgba(15,51,80,0.16)]">
        <div className="board-grid absolute inset-[7%]" />
      </div>
      <div className="shogi-piece absolute left-[12%] top-[12%] -rotate-12 bg-navy text-warmWhite shadow-xl">
        <span className="shogi-piece__label">農</span>
      </div>
      <div className="shogi-piece absolute bottom-[10%] right-[8%] rotate-12 bg-warmWhite text-navy shadow-xl ring-1 ring-navy/20">
        <span className="shogi-piece__label">工</span>
      </div>
      <span className="absolute right-[1%] top-[8%] font-mincho text-xs tracking-[0.35em] text-navy/50 [writing-mode:vertical-rl]">
        農工大で、王手より先に単位をかける。
      </span>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 -z-10 bg-grid opacity-50" aria-hidden="true" />
      <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-site items-center gap-12 px-5 py-16 md:min-h-[620px] md:px-8 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-24">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-3 text-sm font-medium tracking-[0.16em] text-navy md:text-base">
            <span className="h-px w-9 bg-gold" aria-hidden="true" />
            {siteConfig.universityName}将棋部 公式Webサイト
          </p>
          <h1
            id="hero-title"
            className="font-mincho text-[clamp(2rem,7vw,4.5rem)] font-bold leading-[1.28] tracking-[0.035em] text-sumi"
          >
            <span className="block whitespace-nowrap">詰みは見える。</span>
            <span className="block whitespace-nowrap">将来は見えない。</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-ink/75 md:text-lg">
            経験を問わず、将棋を楽しみたい仲間を歓迎します。
            <br className="hidden sm:block" />
            将棋部です。将棋だけしているとは言っていません。
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={siteConfig.cta.visitDmHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-navy px-7 py-3.5 font-bold text-white shadow-lg shadow-navy/15 transition duration-200 hover:-translate-y-0.5 hover:bg-sumi hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4 motion-reduce:transform-none motion-reduce:transition-none"
            >
              XのDMで見学を相談する
              <span className="sr-only">（新しいタブで開く）</span>
            </a>
            <a
              href={siteConfig.cta.scheduleHref}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-navy/40 px-7 py-3.5 font-bold text-navy transition duration-200 hover:bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4 motion-reduce:transition-none"
            >
              活動紹介を見る
            </a>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/65">
            見学をご希望の方は、X（旧Twitter）のDMでその旨をお送りください。
          </p>
        </div>

        <BoardVisual />
      </div>
    </section>
  );
}
