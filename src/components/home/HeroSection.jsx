import { siteConfig } from "../../data/siteConfig";
import { heroImage } from "../../data/imageAssets";

function BoardVisual() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[690px] lg:w-[150%] lg:justify-self-center"
      aria-hidden="true"
    >
      <picture>
        <source
          type="image/avif"
          srcSet={heroImage.avifSrcSet}
          sizes={heroImage.sizes}
        />
        <img
          src={heroImage.fallback}
          srcSet={heroImage.webpSrcSet}
          sizes={heroImage.sizes}
          alt=""
          width={heroImage.width}
          height={heroImage.height}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-auto w-full"
        />
      </picture>
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

          </p>
          <h1
            id="hero-title"
            className="font-mincho text-[clamp(2rem,7vw,4.5rem)] font-bold leading-[1.28] tracking-[0.035em] text-sumi"
          >
            <span className="block whitespace-nowrap">詰みは見える。</span>
            <span className="block whitespace-nowrap">将来は見えない。</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-ink/75 md:text-lg">
            <br className="hidden sm:block" />
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={siteConfig.cta.visitDmHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-navy px-7 py-3.5 font-bold text-white shadow-lg shadow-navy/15 transition duration-200 hover:-translate-y-0.5 hover:bg-sumi hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4 motion-reduce:transform-none motion-reduce:transition-none"
            >
              Twitter(x)で見学を相談する
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
          </p>
        </div>

        <BoardVisual />
      </div>
    </section>
  );
}
