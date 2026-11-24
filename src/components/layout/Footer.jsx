import { emblemImage } from "../../data/imageAssets";
import { navigationItems, siteConfig } from "../../data/siteConfig";

export default function Footer() {
  const internalItems = navigationItems.filter((item) => !item.external);

  return (
    <footer className="bg-[#112840] text-white">
      <div className="mx-auto max-w-site px-5 py-12 md:px-8 md:py-14 lg:px-12">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <a href="/" className="inline-flex items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <img src={emblemImage.fallback} alt="" width={emblemImage.width} height={emblemImage.height} className="h-10 w-10 object-contain" />
              <span className="font-mincho text-lg font-bold tracking-wide">{siteConfig.clubName}</span>
            </a>
            <div className="mt-5 flex flex-col items-start gap-3 text-sm text-white/70">
              <a href={`mailto:${siteConfig.contactEmail}`} className="rounded underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {siteConfig.contactEmail}
              </a>
            </div>
          </div>

          <nav className="lg:col-span-4" aria-label="フッターナビゲーション">
            <h2 className="mb-4 font-mincho text-base font-bold">ナビゲーション</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm text-white/70">
            {internalItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative inline-flex min-h-10 items-center rounded px-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white after:pointer-events-none after:absolute after:inset-x-2 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none"
                >
                  {item.label}
                </a>
              </li>
            ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="mb-4 font-mincho text-base font-bold">公式SNS</h2>
            <a href={siteConfig.xUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              公式X（旧Twitter）を見る<span aria-hidden="true">↗</span><span className="sr-only">（新しいタブで開く）</span>
            </a>
          </div>
        </div>

        <small className="block pt-6 text-center text-xs text-white/55 sm:text-left">© {siteConfig.clubName}</small>
      </div>
    </footer>
  );
}
