import { sortRecordsByPublishedAt } from "./publication.js";

export { sortRecordsByPublishedAt } from "./publication.js";

const legacyPublishedAt = "2026-08-10T00:00:00.000Z";

const recordEntries = [
  {
    year: "2026年度（令和8年度）",
    sourceUrl: "http://kantoshogi.web.fc2.com/kekka/R08/R08kekka.html",
    publishedAt: legacyPublishedAt,
    sortOrder: 100,
    items: [
      { date: "2026.07.19", event: "東日本選抜トーナメント", result: "初戦敗退", detail: "対神奈川大学戦で敗北" },
      { date: "2026.05.24", event: "春季団体戦C2級", result: "2位・昇級", detail: "6勝1敗　C1級へ昇級", highlight: true },
    ],
  },
  {
    year: "2025年度（令和7年度）",
    sourceUrl: "http://kantoshogi.web.fc2.com/kekka/R07/R07kekka.html",
    publishedAt: legacyPublishedAt,
    sortOrder: 101,
    items: [
      { date: "2025.10.12", event: "秋季団体戦C1級", result: "8位・降級", detail: "1勝1分5敗　C2級へ降級" },
      { date: "2025.06.01", event: "春季団体戦B2級", result: "7位・降級", detail: "2勝5敗　C1級へ降級" },
    ],
  },
  {
    year: "2024年度（令和6年度）",
    sourceUrl: "http://kantoshogi.web.fc2.com/kekka/R06/R06kekka.html",
    publishedAt: legacyPublishedAt,
    sortOrder: 102,
    items: [
      { date: "2024.10.20", event: "秋季団体戦B2級", result: "6位", detail: "2勝5敗　B2級残留" },
      { date: "2024.05.19", event: "春季団体戦B2級", result: "3位", detail: "5勝2敗　B2級残留" },
    ],
  },
  {
    year: "2023年度（令和5年度）",
    sourceUrl: "http://kantoshogi.web.fc2.com/kekka/R05/R05kekka.htm",
    publishedAt: legacyPublishedAt,
    sortOrder: 103,
    items: [
      { date: "2023.11.12", event: "秋季団体戦B2級", result: "3位", detail: "4勝3敗　B2級残留" },
      { date: "2023.08.30", event: "春季団体戦C1級", result: "優勝・昇級", detail: "6戦全勝　B2級へ昇級", highlight: true },
    ],
  },
  {
    year: "2022年度（令和4年度）",
    sourceUrl: "http://kantoshogi.web.fc2.com/kekka/R04/R04kekka.htm",
    publishedAt: legacyPublishedAt,
    sortOrder: 104,
    items: [
      { date: "2023.03.17", event: "秋季団体戦B2級", result: "8位・降級", detail: "1勝6敗　C1級へ降級" },
      { date: "2022.09.03", event: "春季団体戦B2級", result: "5位", detail: "2勝3敗　B2級残留" },
    ],
  },
];

export const records = sortRecordsByPublishedAt(recordEntries);
