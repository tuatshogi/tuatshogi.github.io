import { publishedNotices } from "./notices.js";

export const siteOrigin = "https://tuatshogi.github.io";

const staticPageDefinitions = {
  home: {
    id: "home",
    outputFile: "index.html",
    path: "/",
    title: "東京農工大学将棋部｜活動日・見学・大会実績",
    description:
      "東京農工大学将棋部の公式サイトです。小金井キャンパスでの活動、初心者向けの入部・見学案内、大会結果、部室の場所を掲載しています。",
  },
  entry: {
    id: "entry",
    outputFile: "entry.html",
    path: "/entry.html",
    title: "入部・見学案内｜東京農工大学将棋部",
    description:
      "東京農工大学将棋部の入部・見学案内です。活動場所、活動日、部室への行き方、部費、見学の連絡方法をご案内します。初心者も歓迎しています。",
  },
  introduce: {
    id: "introduce",
    outputFile: "introduce.html",
    path: "/introduce.html",
    title: "活動内容・活動日｜東京農工大学将棋部",
    description:
      "東京農工大学将棋部の活動を紹介します。毎週の部室での対局、棋譜検討、部内戦、大学間交流、大会参加などの様子を写真付きで掲載しています。",
  },
  record: {
    id: "record",
    outputFile: "record.html",
    path: "/record.html",
    title: "大会結果・戦績｜東京農工大学将棋部",
    description:
      "東京農工大学将棋部の大会結果と戦績を年度別に掲載しています。関東大学将棋連盟の春季・秋季団体戦における順位、勝敗、昇級記録を確認できます。",
  },
  news: {
    id: "news",
    page: "news",
    outputFile: "news.html",
    path: "/news.html",
    title: "お知らせ｜東京農工大学将棋部",
    description:
      "東京農工大学将棋部からのお知らせを掲載しています。活動や大会に関する最新情報をご覧いただけます。",
  },
};

function noticeDescription(notice) {
  const summary = notice.body.replace(/\s+/g, " ").trim();
  return `${summary || notice.title}`.slice(0, 160);
}

const noticePageDefinitions = Object.fromEntries(
  publishedNotices.map((notice) => [
    `notice:${notice.id}`,
    {
      id: `notice:${notice.id}`,
      page: "notice",
      articleId: notice.id,
      outputFile: `news/${notice.id}.html`,
      path: `/news/${notice.id}.html`,
      title: `${notice.title}｜お知らせ｜東京農工大学将棋部`,
      description: noticeDescription(notice),
    },
  ]),
);

export const pageDefinitions = {
  ...staticPageDefinitions,
  ...noticePageDefinitions,
};

export const pageDefinitionList = Object.values(pageDefinitions).map((page) => ({
  ...page,
  canonicalUrl: new URL(page.path, siteOrigin).href,
}));

export const ogImage = {
  url: `${siteOrigin}/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: "藍色の将棋盤と駒を背景に、東京農工大学将棋部とキャッチコピーを記した画像",
};

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "東京農工大学将棋部",
  alternateName: "農工大将棋部",
  description: pageDefinitions.home.description,
  url: `${siteOrigin}/`,
  logo: `${siteOrigin}/organization-logo.png`,
  email: "tuatshogi@gmail.com",
  sameAs: ["https://x.com/tuatshogiclub"],
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "東京農工大学",
    url: "https://www.tuat.ac.jp/",
  },
};
