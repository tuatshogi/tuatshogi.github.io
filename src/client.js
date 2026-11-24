import "./index.css";
import "./home-sections.css";
import {
  cmsRefreshIntervalMs,
  fetchCmsSnapshot,
  shouldUseCms,
} from "./data/cms";
import { isSafeNoticeUrl, noticeHref } from "./data/publication";

const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNavigation = document.getElementById("mobile-navigation");

if (menuToggle && mobileNavigation) {
  const desktopQuery = window.matchMedia("(min-width: 1280px)");
  const menuLinks = mobileNavigation.querySelectorAll("[data-menu-link]");

  const isMenuOpen = () => menuToggle.getAttribute("aria-expanded") === "true";

  const setMenuOpen = (open, { restoreFocus = false } = {}) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileNavigation.setAttribute("aria-hidden", String(!open));
    mobileNavigation.inert = !open;
    mobileNavigation.classList.toggle("visible", open);
    mobileNavigation.classList.toggle("max-h-96", open);
    mobileNavigation.classList.toggle("invisible", !open);
    mobileNavigation.classList.toggle("max-h-0", !open);

    if (!open && restoreFocus) {
      menuToggle.focus();
    }
  };

  menuToggle.addEventListener("click", () => setMenuOpen(!isMenuOpen()));

  for (const link of menuLinks) {
    link.addEventListener("click", () => setMenuOpen(false));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenuOpen(false, { restoreFocus: true });
    }
  });

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
}

const homeNewsSection = document.querySelector(".home-news-section");

if (homeNewsSection) {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mixRgb = (start, end, progress) => start
    .map((channel, index) => Math.round(channel + (end[index] - channel) * progress))
    .join(", ");
  let colorFrame = 0;

  const updateScrollColor = () => {
    const rect = homeNewsSection.getBoundingClientRect();
    const viewportHeight = Math.max(1, window.innerHeight);
    const finishAt = viewportHeight * 0.22;
    const progress = reducedMotionQuery.matches
      ? 0
      : Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight - finishAt)));

    homeNewsSection.style.setProperty("--home-news-background", `rgb(${mixRgb([247, 245, 239], [17, 40, 64], progress)})`);
    homeNewsSection.style.setProperty("--home-news-heading", `rgb(${mixRgb([17, 40, 64], [249, 249, 248], progress)})`);
    homeNewsSection.style.setProperty("--home-news-action", `rgb(${mixRgb([133, 83, 14], [226, 184, 108], progress)})`);
    homeNewsSection.style.setProperty("--home-news-indicator", `rgb(${mixRgb([17, 40, 64], [226, 184, 108], progress)})`);
    homeNewsSection.style.setProperty("--home-news-border", `rgb(${mixRgb([228, 231, 226], [77, 87, 100], progress)})`);
  };

  const scheduleScrollColorUpdate = () => {
    if (colorFrame) return;
    colorFrame = window.requestAnimationFrame(() => {
      colorFrame = 0;
      updateScrollColor();
    });
  };

  updateScrollColor();
  window.addEventListener("scroll", scheduleScrollColorUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollColorUpdate);
  reducedMotionQuery.addEventListener("change", scheduleScrollColorUpdate);

  const activityCubes = Array.from(document.querySelectorAll("[data-activity-cube]"));

  if (activityCubes.length) {
    let activityCubeFrame = 0;

    const updateActivityCubes = () => {
      activityCubeFrame = 0;
      const viewportHeight = Math.max(1, window.innerHeight);
      const maximumTurn = window.innerWidth < 768 ? 12 : 55;

      activityCubes.forEach((cube) => {
        if (reducedMotionQuery.matches) {
          cube.style.setProperty("--activity-cube-turn", "0deg");
          return;
        }

        const bounds = cube.parentElement.getBoundingClientRect();
        const center = bounds.top + bounds.height / 2;
        const start = viewportHeight * 1.2 + bounds.height / 2;
        const front = viewportHeight * (2 / 3) + bounds.height / 2;
        const progress = Math.max(0, Math.min(1, (start - center) / (start - front)));
        const turn = -maximumTurn * (1 - progress);
        cube.style.setProperty("--activity-cube-turn", `${turn.toFixed(2)}deg`);
      });
    };

    const scheduleActivityCubeUpdate = () => {
      if (activityCubeFrame) return;
      activityCubeFrame = window.requestAnimationFrame(updateActivityCubes);
    };

    updateActivityCubes();
    window.addEventListener("scroll", scheduleActivityCubeUpdate, { passive: true });
    window.addEventListener("resize", scheduleActivityCubeUpdate, { passive: true });
    reducedMotionQuery.addEventListener("change", scheduleActivityCubeUpdate);
  }

  const staggerGroups = document.querySelectorAll("[data-stagger-group]");
  const staggerItems = Array.from(document.querySelectorAll("[data-stagger-item]"));

  if (staggerItems.length && "IntersectionObserver" in window && !reducedMotionQuery.matches) {
    staggerGroups.forEach((group) => {
      group.querySelectorAll("[data-stagger-item]").forEach((item, index) => {
        item.style.setProperty("--stagger-delay", `${Math.min(index * 90, 450)}ms`);
        item.dataset.staggerState = "pending";
        item.inert = true;
      });
    });

    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.staggerState = "visible";
        entry.target.inert = false;
        staggerObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
    staggerItems.forEach((item) => staggerObserver.observe(item));

    reducedMotionQuery.addEventListener("change", (event) => {
      if (!event.matches) return;
      staggerObserver.disconnect();
      staggerItems.forEach((item) => {
        item.dataset.staggerState = "visible";
        item.inert = false;
      });
    });
  }

  const newsSliceOverlay = homeNewsSection.querySelector("[data-news-slice-overlay]");

  if (newsSliceOverlay && !reducedMotionQuery.matches) {
    homeNewsSection.dataset.sliceTransition = "pending";

    newsSliceOverlay.addEventListener("transitionend", (event) => {
      if (event.target !== newsSliceOverlay.lastElementChild || event.propertyName !== "transform") return;
      homeNewsSection.dataset.sliceTransition = "opened";
    });

    const revealNewsSlices = () => {
      homeNewsSection.dataset.sliceTransition = reducedMotionQuery.matches ? "opened" : "opening";
    };

    if (!("IntersectionObserver" in window)) {
      homeNewsSection.dataset.sliceTransition = "opened";
    } else {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        revealNewsSlices();
        observer.disconnect();
      }, { rootMargin: "0px 0px -15% 0px", threshold: 0 });

      observer.observe(homeNewsSection);
    }

    reducedMotionQuery.addEventListener("change", (event) => {
      if (event.matches) homeNewsSection.dataset.sliceTransition = "opened";
    });
  }
}

const rootElement = document.getElementById("root");

if (rootElement) {
  const initialTitle = document.title;
  const requestedNoticeId = (() => {
    const queryId = new URLSearchParams(location.search).get("id");
    if (queryId && /^[A-Za-z0-9_-]{1,64}$/.test(queryId)) return queryId;
    const pathMatch = location.pathname.match(/^\/news\/([A-Za-z0-9_-]{1,64})\.html$/);
    return pathMatch?.[1];
  })();

  const element = (tagName, className, text) => {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const appendSafeBody = (container, body) => {
    const urlPattern = /https?:\/\/[^\s<>"']+/g;
    const trailingPunctuation = /[.,!?;:、。！？；：)\]}]+$/;
    for (const paragraphText of body.split(/\n\s*\n/)) {
      const paragraph = element("p");
      const lines = paragraphText.split("\n");
      lines.forEach((line, lineIndex) => {
        let cursor = 0;
        for (const match of line.matchAll(urlPattern)) {
          const start = match.index;
          const rawUrl = match[0];
          const punctuation = rawUrl.match(trailingPunctuation)?.[0] ?? "";
          const url = punctuation ? rawUrl.slice(0, -punctuation.length) : rawUrl;
          paragraph.append(document.createTextNode(line.slice(cursor, start)));
          if (isSafeNoticeUrl(url)) {
            const link = element("a", "rounded font-medium text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy", url);
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            const assistiveText = element("span", "sr-only", "（新しいタブで開く）");
            link.append(assistiveText);
            paragraph.append(link, document.createTextNode(punctuation));
          } else {
            paragraph.append(document.createTextNode(rawUrl));
          }
          cursor = start + rawUrl.length;
        }
        paragraph.append(document.createTextNode(line.slice(cursor)));
        if (lineIndex < lines.length - 1) paragraph.append(document.createElement("br"));
      });
      container.append(paragraph);
    }
  };

  const createNoticeList = (notices, { limit, showPublishedDate, layout }) => {
    const visibleNotices = Number.isInteger(limit) ? notices.slice(0, limit) : notices;
    const isCarouselLayout = layout === "carousel";
    const isCardLayout = layout === "cards" || isCarouselLayout;
    const syncAttributes = (node) => {
      node.dataset.cmsNoticeList = "";
      node.dataset.limit = Number.isInteger(limit) ? String(limit) : "";
      node.dataset.showPublishedDate = String(showPublishedDate);
      node.dataset.layout = layout;
      if (isCarouselLayout) {
        node.id = "home-news-track";
        node.tabIndex = 0;
        node.setAttribute("aria-label", "お知らせ");
      }
      return node;
    };
    if (visibleNotices.length === 0) {
      if (isCarouselLayout) {
        const list = syncAttributes(element("ul", "home-news-track"));
        const item = element("li", "home-news-empty-slide");
        item.append(element("p", "home-news-empty", "現在、お知らせはありません。"));
        list.append(item);
        return list;
      }
      const emptyClassName = isCardLayout
        ? "rounded-xl border border-dashed border-[#C4C6CE] bg-white/70 px-5 py-8 text-center text-[#626B77]"
        : "rounded-xl border border-dashed border-line bg-white/60 px-5 py-8 text-center text-ink/65";
      return syncAttributes(element("p", emptyClassName, "現在、お知らせはありません。"));
    }
    if (isCardLayout) {
      const list = syncAttributes(element("ul", isCarouselLayout ? "home-news-track" : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"));
      const formatCardDate = (value) => new Intl.DateTimeFormat("ja-JP", {
        year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Tokyo",
      }).format(new Date(value)).replaceAll("/", ".");
      for (const notice of visibleNotices) {
        const item = element("li", isCarouselLayout ? "home-news-slide" : "min-w-0");
        const card = element("a", "group flex h-full min-h-[clamp(172px,42svh,360px)] flex-col rounded-xl border border-[#E4E7E2] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(17,40,64,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#D99B52] hover:shadow-[0_10px_24px_-12px_rgba(17,40,64,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2");
        card.href = noticeHref(notice.id);
        const meta = element("div", "flex items-center justify-between gap-2");
        meta.append(element("span", "rounded-full bg-[#F3F4F1] px-2.5 py-1 text-[11px] font-semibold leading-4 text-[#112840]", "お知らせ"));
        if (showPublishedDate) {
          const time = element("time", "shrink-0 text-xs text-[#626B77]", formatCardDate(notice.publishedAt));
          time.dateTime = notice.publishedAt;
          meta.append(time);
        }
        const title = element("h3", "mt-4 flex-1 font-mincho text-base font-bold leading-7 text-[#112840] transition-colors group-hover:text-[#85530E]", notice.title);
        const arrow = element("span", "mt-3 self-end text-lg text-[#626B77] transition-transform group-hover:translate-x-1 group-hover:text-[#85530E]", "→");
        arrow.setAttribute("aria-hidden", "true");
        card.append(meta, title, arrow);
        item.append(card);
        list.append(item);
      }
      return list;
    }
    const list = syncAttributes(element("ul", "divide-y divide-line rounded-xl border border-line bg-white"));
    for (const notice of visibleNotices) {
      const item = element("li", "px-5 py-5 md:flex md:items-center md:gap-6 md:px-6");
      if (showPublishedDate) {
        const time = element("time", "shrink-0 text-sm text-ink/60", new Intl.DateTimeFormat("ja-JP", {
          year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tokyo",
        }).format(new Date(notice.publishedAt)));
        time.dateTime = notice.publishedAt;
        item.append(time);
      }
      const href = noticeHref(notice.id);
      const title = element("a", "mt-2 block flex-1 font-bold text-sumi underline decoration-transparent underline-offset-4 hover:decoration-sumi/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy md:mt-0", notice.title);
      title.href = href;
      const detail = element("a", "mt-3 inline-flex min-h-11 items-center rounded-md border border-navy/30 px-4 py-2 text-sm font-bold text-navy hover:bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy md:mt-0", "詳細を見る");
      detail.href = href;
      item.append(title, detail);
      list.append(item);
    }
    return list;
  };

  const updateNewsCarousels = () => {
    for (const carousel of document.querySelectorAll("[data-news-carousel]")) {
      const track = carousel.querySelector("[data-cms-notice-list]");
      const indicators = carousel.querySelector("[data-news-page-indicators]");
      const previous = carousel.querySelector('[data-news-direction="-1"]');
      const next = carousel.querySelector('[data-news-direction="1"]');
      if (!track || !indicators || !previous || !next) continue;

      if (carousel.dataset.newsCarouselBound !== "true") {
        carousel.dataset.newsCarouselBound = "true";
        carousel.addEventListener("click", (event) => {
          if (!(event.target instanceof Element)) return;
          const control = event.target.closest("[data-news-direction], [data-news-page]");
          if (!control || !carousel.contains(control)) return;
          const currentTrack = carousel.querySelector("[data-cms-notice-list]");
          if (!currentTrack) return;
          const scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth";

          if (control.dataset.newsPage !== undefined) {
            const pageCount = Math.max(1, Math.ceil(currentTrack.scrollWidth / Math.max(1, currentTrack.clientWidth)));
            const lastPage = pageCount - 1;
            const targetPage = Number(control.dataset.newsPage);
            const maxScroll = Math.max(0, currentTrack.scrollWidth - currentTrack.clientWidth);
            currentTrack.scrollTo({
              left: lastPage > 0 ? maxScroll * (targetPage / lastPage) : 0,
              behavior: scrollBehavior,
            });
            return;
          }

          currentTrack.scrollBy({
            left: Number(control.dataset.newsDirection) * currentTrack.clientWidth,
            behavior: scrollBehavior,
          });
        });
      }

      if (track.dataset.newsCarouselBound !== "true") {
        track.dataset.newsCarouselBound = "true";
        track.addEventListener("scroll", () => requestAnimationFrame(updateNewsCarousels), { passive: true });
      }

      const pageCount = Math.max(1, Math.ceil(track.scrollWidth / Math.max(1, track.clientWidth)));
      if (indicators.children.length !== pageCount || indicators.firstElementChild?.tagName !== "BUTTON") {
        indicators.replaceChildren();
        for (let index = 0; index < pageCount; index += 1) {
          const indicator = element("button", "home-news-indicator");
          indicator.type = "button";
          indicator.dataset.newsPage = String(index);
          indicator.setAttribute("aria-label", `お知らせ ${index + 1}ページ目へ`);
          indicators.append(indicator);
        }
      }

      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const activePage = pageCount > 1 && maxScroll > 0
        ? Math.round((track.scrollLeft / maxScroll) * (pageCount - 1))
        : 0;
      [...indicators.children].forEach((indicator, index) => {
        if (index === activePage) indicator.setAttribute("aria-current", "true");
        else indicator.removeAttribute("aria-current");
        indicator.classList.toggle("home-news-indicator--current", index === activePage);
      });

      previous.disabled = maxScroll <= 1 || track.scrollLeft <= 1;
      next.disabled = maxScroll <= 1 || track.scrollLeft >= maxScroll - 1;
    }
  };

  const renderNoticeLists = (notices) => {
    const lists = [...document.querySelectorAll("[data-cms-notice-list]")];
    for (const list of lists) {
      const parsedLimit = Number(list.dataset.limit);
      list.replaceWith(createNoticeList(notices, {
        limit: list.dataset.limit === "" || !Number.isInteger(parsedLimit) ? undefined : parsedLimit,
        showPublishedDate: list.dataset.showPublishedDate !== "false",
        layout: list.dataset.layout ?? "list",
      }));
    }
    updateNewsCarousels();
  };

  const renderNewsPage = (notices, detailNotice) => {
    const content = document.querySelector("[data-cms-news-content]");
    const title = document.querySelector("[data-cms-news-title]");
    if (!content || !title || !requestedNoticeId) return;
    const lead = document.querySelector("[data-cms-news-lead]");
    const notice = detailNotice ?? notices.find((item) => item.id === requestedNoticeId);
    content.replaceChildren();
    if (!notice) {
      title.textContent = "お知らせ一覧";
      if (lead) lead.hidden = false;
      content.append(createNoticeList(notices, { showPublishedDate: true }));
      document.title = initialTitle;
      return;
    }
    title.textContent = notice.title;
    if (lead) lead.hidden = true;
    const article = element("article");
    const time = element("time", "text-sm text-ink/60", new Intl.DateTimeFormat("ja-JP", {
      year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tokyo",
    }).format(new Date(notice.publishedAt)));
    time.dateTime = notice.publishedAt;
    const body = element("div", "mt-8 space-y-6 leading-8 text-ink/80");
    appendSafeBody(body, notice.body);
    article.append(time, body);
    if (notice.linkUrl) {
      const paragraph = element("p", "mt-10");
      const link = element("a", "inline-flex min-h-11 items-center rounded-md border border-navy/30 px-5 py-3 font-bold text-navy hover:bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy", "関連リンク");
      link.href = notice.linkUrl;
      paragraph.append(link);
      article.append(paragraph);
    }
    if (notice.attachments.length > 0) {
      const section = element("section", "mt-12");
      section.setAttribute("aria-labelledby", "notice-attachments-title");
      const heading = element("h2", "font-mincho text-2xl font-bold text-sumi", "添付画像");
      heading.id = "notice-attachments-title";
      const images = element("div", "mt-6 space-y-6");
      for (const attachment of notice.attachments) {
        if (attachment.expired) {
          images.append(element("p", "rounded-xl border border-dashed border-line bg-white/60 px-5 py-8 text-center text-ink/65", "期限切れのため画像を表示できません。"));
          continue;
        }
        const figure = element("figure", "overflow-hidden rounded-xl border border-line bg-white p-2 shadow-[0_12px_35px_rgba(15,51,80,0.10)] md:p-3");
        const image = element("img", "h-auto w-full rounded-lg");
        image.src = attachment.path;
        image.alt = attachment.alt;
        image.width = attachment.width;
        image.height = attachment.height;
        image.loading = "lazy";
        image.decoding = "async";
        const responsive = Object.entries(attachment.responsive);
        if (responsive.length > 0) {
          const picture = element("picture");
          for (const [format, path] of responsive) {
            const source = element("source");
            source.type = `image/${format}`;
            source.srcset = path;
            picture.append(source);
          }
          picture.append(image);
          figure.append(picture);
        } else {
          figure.append(image);
        }
        images.append(figure);
      }
      section.append(heading, images);
      article.append(section);
    }
    const backParagraph = element("p");
    const back = element("a", "font-bold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy", "お知らせ一覧へ戻る");
    back.href = "/news.html";
    backParagraph.append(back);
    content.append(article, backParagraph);
    document.title = `${notice.title}｜お知らせ｜東京農工大学将棋部`;
  };

  const renderRecords = (records) => {
    const container = document.querySelector("[data-cms-record-list]");
    if (!container) return;
    container.replaceChildren();
    if (records.length === 0) {
      container.append(element("p", "rounded-xl border border-dashed border-line bg-white/60 px-5 py-8 text-center text-ink/65", "現在、公開中の大会記録はありません。"));
      return;
    }
    for (const record of records) {
      const section = element("section");
      const headingRow = element("div", "flex flex-wrap items-end justify-between gap-3");
      const heading = element("h2", "font-mincho text-2xl font-bold text-sumi md:text-3xl", record.year);
      const source = element("a", "text-sm font-medium text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy", "公式結果を見る");
      source.href = record.sourceUrl;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.append(element("span", "sr-only", "（新しいタブで開く）"));
      headingRow.append(heading, source);
      const list = element("ul", "mt-5 space-y-4");
      for (const recordItem of record.items) {
        const item = element("li", "rounded-xl border border-line bg-white p-5 md:flex md:items-center md:gap-6 md:p-6");
        item.append(element("time", "text-sm text-ink/70", recordItem.date));
        const detail = element("div", "mt-2 flex-1 md:mt-0");
        detail.append(
          element("p", "font-bold text-sumi", recordItem.event),
          element("p", "mt-1 text-sm text-ink/70", recordItem.detail),
        );
        item.append(
          detail,
          element("span", `mt-3 inline-block rounded-full px-3 py-1 text-sm font-bold md:mt-0 ${recordItem.highlight ? "bg-gold text-navy" : "bg-navy/10 text-navy"}`, recordItem.result),
        );
        list.append(item);
      }
      section.append(headingRow, list);
      container.append(section);
    }
  };

  const cmsPage = rootElement.dataset.page;
  const usesCmsData = ["home", "record", "news", "notice"].includes(cmsPage);

  updateNewsCarousels();
  window.addEventListener("resize", updateNewsCarousels, { passive: true });

  if (shouldUseCms() && usesCmsData) {
    let syncInFlight;
    let hasLoggedFailure = false;
    let lastAttemptAt = 0;

    const sync = async () => {
      if (syncInFlight) return syncInFlight;
      const now = Date.now();
      if (now - lastAttemptAt < cmsRefreshIntervalMs) return;
      lastAttemptAt = now;
      rootElement.dataset.cmsSync = "loading";
      syncInFlight = fetchCmsSnapshot()
        .then((snapshot) => {
          renderNoticeLists(snapshot.notices);
          renderNewsPage(snapshot.notices);
          renderRecords(snapshot.records);
          rootElement.dataset.cmsSync = "ready";
          hasLoggedFailure = false;
        })
        .catch((error) => {
          rootElement.dataset.cmsSync = "fallback";
          if (!hasLoggedFailure) {
            console.warn("CMSの公開データを取得できないため、静的データを表示します。", error);
            hasLoggedFailure = true;
          }
        })
        .finally(() => { syncInFlight = undefined; });
      return syncInFlight;
    };

    const scheduleSync = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => { void sync(); }, { timeout: 1000 });
      } else {
        window.setTimeout(() => { void sync(); }, 0);
      }
    };

    scheduleSync();
    window.setInterval(() => {
      if (document.visibilityState === "visible") scheduleSync();
    }, cmsRefreshIntervalMs);
    window.addEventListener("focus", scheduleSync);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") scheduleSync();
    });
  }
}
