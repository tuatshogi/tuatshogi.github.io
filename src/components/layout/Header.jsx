import { emblemImage, logoImage } from "../../data/imageAssets";
import { navigationItems, siteConfig } from "../../data/siteConfig";

function NavigationLink({ item, currentPage, mobile = false }) {
  return (
    <a
      href={item.href}
      aria-current={!item.external && item.page === currentPage ? "page" : undefined}
      data-menu-link={mobile ? "" : undefined}
      {...(item.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="relative block rounded px-2 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy after:pointer-events-none after:absolute after:inset-x-2 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=page]:after:scale-x-100 motion-reduce:after:transition-none"
    >
      {item.label}
      {item.external && <span className="sr-only">（新しいタブで開く）</span>}
    </a>
  );
}

export default function Header({ currentPage = "home" }) {
  const desktopItems = navigationItems.filter((item) => !item.external && item.page !== "home");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#112840]/95 text-white shadow-md backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-site items-center gap-3 px-5 md:h-20 md:gap-5 md:px-8 lg:px-12">
        <a
          href="/"
          className="flex min-w-0 items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:gap-4"
          aria-label={`${siteConfig.clubName} トップ`}
        >
          <img
            src={emblemImage.fallback}
            srcSet={emblemImage.webpSrcSet}
            sizes={emblemImage.sizes}
            alt=""
            width={emblemImage.width}
            height={emblemImage.height}
            fetchPriority="low"
            className="h-11 w-11 shrink-0 object-contain md:h-12 md:w-12"
          />
          <img
            src={logoImage.fallback}
            srcSet={logoImage.webpSrcSet}
            sizes={logoImage.sizes}
            alt=""
            width={logoImage.width}
            height={logoImage.height}
            fetchPriority="low"
            className="max-h-10 min-w-0 max-w-[48vw] object-contain md:max-h-12 md:max-w-[260px]"
          />
        </a>

        <nav className="ml-auto hidden xl:block" aria-label="メインナビゲーション">
          <ul className="flex items-center gap-1">
            {desktopItems.map((item) => (
              <li key={item.href}>
                <NavigationLink item={item} currentPage={currentPage} />
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={siteConfig.cta.visitDmHref}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto hidden min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#2D6846] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#24563A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#112840] sm:inline-flex xl:ml-0"
        >
          <span aria-hidden="true">↗</span>
          見学・体験を相談
          <span className="sr-only">（新しいタブで開く）</span>
        </a>

        <button
          type="button"
          data-menu-toggle
          className="ml-auto flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/30 px-3 text-xs font-bold tracking-[0.16em] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white xl:hidden"
          aria-expanded="false"
          aria-controls="mobile-navigation"
        >
          MENU
        </button>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="モバイルナビゲーション"
        aria-hidden="true"
        inert={true}
        className="absolute inset-x-0 top-full invisible max-h-0 overflow-hidden bg-[#112840] shadow-lg transition-[max-height,visibility] duration-300 xl:hidden"
      >
        <ul className="space-y-1 px-5 py-4">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <NavigationLink
                item={item}
                currentPage={currentPage}
                mobile
              />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
