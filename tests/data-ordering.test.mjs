import assert from "node:assert/strict";
import { sortNoticesByPublishedAt } from "../src/data/notices.js";
import { records, sortRecordsByPublishedAt } from "../src/data/records.js";

const notices = sortNoticesByPublishedAt([
  { id: "older", publishedAt: "2026-08-01T09:00:00+09:00" },
  { id: "newer", publishedAt: "2026-08-01T18:00:00+09:00" },
]);
assert.deepEqual(notices.map((notice) => notice.id), ["newer", "older"]);

const sameTimeNotices = sortNoticesByPublishedAt([
  { id: "low", publishedAt: "2026-08-02T09:00:00+09:00", sortOrder: 20 },
  { id: "high", publishedAt: "2026-08-02T09:00:00+09:00", sortOrder: 10 },
]);
assert.deepEqual(sameTimeNotices.map((notice) => notice.id), ["high", "low"]);

const seasons = sortRecordsByPublishedAt([
  { year: "older", publishedAt: "2026-01-01T00:00:00Z", sortOrder: -100 },
  { year: "newer", publishedAt: "2026-02-01T00:00:00Z", sortOrder: 100 },
]);
assert.deepEqual(seasons.map((season) => season.year), ["newer", "older"]);

const sameDateSeasons = sortRecordsByPublishedAt([
  { year: "2025年度", publishedAt: "2026-08-01T00:00:00Z", sortOrder: 0 },
  { year: "2026年度", publishedAt: "2026-08-01T00:00:00Z", sortOrder: 0 },
]);
assert.deepEqual(sameDateSeasons.map((season) => season.year), ["2026年度", "2025年度"]);
assert.deepEqual(records.map((season) => season.year), [
  "2026年度（令和8年度）",
  "2025年度（令和7年度）",
  "2024年度（令和6年度）",
  "2023年度（令和5年度）",
  "2022年度（令和4年度）",
]);

console.log("Publication ordering checks passed.");
