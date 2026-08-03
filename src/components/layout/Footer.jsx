import { navigationItems, siteConfig } from "../../data/siteConfig";

export default function Footer() {
  const internalItems = navigationItems.filter((item) => !item.external);

  return (
    <footer className="bg-navy text-white/85">
      <div className="mx-auto flex max-w-site flex-col items-center px-5 py-12 text-center md:px-8 md:py-16 lg:px-12">
        <nav aria-label="フッターナビゲーション">
          <ul className="flex flex-col items-center gap-3 md:flex-row md:gap-8">
            {internalItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded px-2 text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-7 flex items-center gap-5">
          <a
            href={siteConfig.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X（旧Twitter）を新しいタブで開く"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/30 transition hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
            </svg>
          </a>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="rounded text-sm underline decoration-white/30 underline-offset-4 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {siteConfig.contactEmail}
          </a>
        </div>

        <small className="mt-7 text-xs text-white/60">© {siteConfig.clubName}</small>
      </div>
    </footer>
  );
}
