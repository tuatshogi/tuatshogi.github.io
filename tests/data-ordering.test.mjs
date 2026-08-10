import assert from "node:assert/strict";
import { sortNoticesByPublishedAt } from "../src/data/notices.js";
import { records, sortRecordsByPublishedAt } from "../src/data/records.js";

const notices = sortNoticesByPublishedAt([
  { id: "older", publishedAt: "2026-01-01T00:00:00Z", sortOrder: -100 },
  { id: "newer", publishedAt: "2026-02-01T00:00:00Z", sortOrder: 100 },
]);
assert.deepEqual(notices.map((notice) => notice.id), ["newer", "older"]);

const seasons = sortRecordsByPublishedAt([
  { year: "older", publishedAt: "2026-01-01T00:00:00Z", sortOrder: -100 },
  { year: "newer", publishedAt: "2026-02-01T00:00:00Z", sortOrder: 100 },
]);
assert.deepEqual(seasons.map((season) => season.year), ["newer", "older"]);
assert.deepEqual(records.map((season) => season.year), [
  "2026年度（令和8年度）",
  "2025年度（令和7年度）",
  "2024年度（令和6年度）",
  "2023年度（令和5年度）",
  "2022年度（令和4年度）",
]);

console.log("Publication ordering checks passed.");
