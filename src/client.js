import "./index.css";
import {
  cmsRefreshIntervalMs,
  fetchCmsSnapshot,
  shouldUseCms,
} from "./data/cms";
import { isSafeNoticeUrl, noticeHref } from "./data/publication";

const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNavigation = document.getElementById("mobile-navigation");

if (menuToggle && mobileNavigation) {
  const desktopQuery = window.matchMedia("(min-width: 768px)");
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

  const createNoticeList = (notices, { limit, showPublishedDate }) => {
    const visibleNotices = Number.isInteger(limit) ? notices.slice(0, limit) : notices;
    const syncAttributes = (node) => {
      node.dataset.cmsNoticeList = "";
      node.dataset.limit = Number.isInteger(limit) ? String(limit) : "";
      node.dataset.showPublishedDate = String(showPublishedDate);
      return node;
    };
    if (visibleNotices.length === 0) {
      return syncAttributes(element("p", "rounded-xl border border-dashed border-line bg-white/60 px-5 py-8 text-center text-ink/65", "現在、お知らせはありません。"));
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

  const renderNoticeLists = (notices) => {
    const lists = [...document.querySelectorAll("[data-cms-notice-list]")];
    for (const list of lists) {
      const parsedLimit = Number(list.dataset.limit);
      list.replaceWith(createNoticeList(notices, {
        limit: list.dataset.limit === "" || !Number.isInteger(parsedLimit) ? undefined : parsedLimit,
        showPublishedDate: list.dataset.showPublishedDate !== "false",
      }));
    }
  };

  const renderNewsPage = (notices) => {
    const content = document.querySelector("[data-cms-news-content]");
    const title = document.querySelector("[data-cms-news-title]");
    if (!content || !title || !requestedNoticeId) return;
    const lead = document.querySelector("[data-cms-news-lead]");
    const notice = notices.find((item) => item.id === requestedNoticeId);
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

  if (shouldUseCms()) {
    let syncInFlight;
    let hasLoggedFailure = false;
    const sync = async () => {
      if (syncInFlight) return syncInFlight;
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

    void sync();
    window.setInterval(() => {
      if (document.visibilityState === "visible") void sync();
    }, cmsRefreshIntervalMs);
    window.addEventListener("focus", () => { void sync(); });
  }
}
