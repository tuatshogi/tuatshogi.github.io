import { useEffect, useRef, useState } from "react";
import { navigationItems, siteConfig } from "../../data/siteConfig";

function NavigationLink({ item, onClick }) {
  return (
    <a
      href={item.href}
      onClick={onClick}
      {...(item.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="block rounded px-2 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
    >
      {item.label}
      {item.external && <span className="sr-only">（新しいタブで開く）</span>}
    </a>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const handleDesktop = (event) => event.matches && setIsMenuOpen(false);

    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleDesktop);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleDesktop);
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-navy/95 text-white shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-site items-center gap-3 px-5 md:h-[96px] md:gap-5 md:px-8 lg:px-12">
        <a
          href="/"
          className="flex min-w-0 items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:gap-4"
          aria-label={`${siteConfig.clubName} トップ`}
        >
          <img
            src={siteConfig.emblemSrc}
            alt=""
            width="72"
            height="72"
            className="h-12 w-12 shrink-0 object-contain md:h-[72px] md:w-[72px]"
          />
          <img
            src={siteConfig.logoSrc}
            alt=""
            className="max-h-11 min-w-0 max-w-[45vw] object-contain md:max-h-16 md:max-w-[280px]"
          />
        </a>

        <nav className="ml-auto hidden md:block" aria-label="メインナビゲーション">
          <ul className="flex items-center gap-2 lg:gap-5">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <NavigationLink item={item} />
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="ml-auto flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/40 px-3 text-xs font-bold tracking-[0.16em] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          MENU
        </button>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="モバイルナビゲーション"
        aria-hidden={!isMenuOpen}
        className={`absolute inset-x-0 top-full overflow-hidden bg-navy shadow-lg transition-[max-height,visibility] duration-300 md:hidden ${
          isMenuOpen ? "visible max-h-96" : "invisible max-h-0"
        }`}
      >
        <ul className="space-y-1 px-5 py-4">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <NavigationLink item={item} onClick={() => setIsMenuOpen(false)} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
