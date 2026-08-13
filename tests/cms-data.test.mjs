import assert from "node:assert/strict";
import {
  cmsSnapshotUrl,
  fetchCmsSnapshot,
  normalizeCmsSnapshot,
  shouldUseCms,
} from "../src/data/cms.js";

const snapshot = {
  notices: [
    {
      id: "scheduled",
      title: "予約",
      body: "未来",
      linkUrl: null,
      publishedAt: "2099-08-10T13:10:00.000Z",
      sortOrder: 0,
      attachments: [],
    },
    {
      id: "published",
      title: "公開済み",
      body: "一行目\n二行目",
      linkUrl: "/record.html",
      publishedAt: "2026-08-10T13:10:00.000Z",
      sortOrder: 0,
      attachments: [
        {
          id: "image-1",
          path: "images/cms.webp",
          alt: "CMS画像",
          mimeType: "image/webp",
          sizeBytes: 10,
          width: 100,
          height: 50,
          responsive: {},
        },
      ],
    },
  ],
  records: [
    {
      year: "2099年度",
      sourceUrl: "https://example.com/future",
      publishedAt: "2099-08-10T13:10:00.000Z",
      sortOrder: 0,
      items: [],
    },
    {
      year: "2026年度",
      sourceUrl: "https://example.com/results",
      publishedAt: "2026-08-10T13:10:00.000Z",
      sortOrder: 1,
      items: [
        { date: "2026.05.24", event: "団体戦", result: "2位", detail: "6勝1敗", highlight: true },
      ],
    },
  ],
};

const normalized = normalizeCmsSnapshot(snapshot, { now: Date.parse("2026-08-10T13:11:00Z") });
assert.deepEqual(normalized.notices.map((notice) => notice.id), ["published"]);
assert.equal(normalized.notices[0].sortOrder, 0);
assert.equal(normalized.notices[0].attachments[0].path, "/images/cms.webp");
assert.deepEqual(normalized.records.map((record) => record.year), ["2026年度"]);
assert.equal(normalized.records[0].items[0].highlight, true);

let requestedUrl;
let requestedOptions;
const fetched = await fetchCmsSnapshot({
  fetchImpl: async (url, options) => {
    requestedUrl = url;
    requestedOptions = options;
    return new Response(JSON.stringify({ notices: [], records: [] }), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  },
});
assert.equal(requestedUrl, cmsSnapshotUrl);
assert.equal(requestedOptions.credentials, "omit");
assert.equal(requestedOptions.cache, "default");
assert.deepEqual(fetched, { notices: [], records: [] });

assert.throws(
  () => normalizeCmsSnapshot({ notices: [{ id: "bad" }], records: [] }),
  /is invalid|must be an array/,
);
assert.equal(shouldUseCms({ hostname: "tuatshogi.github.io", search: "" }), true);
assert.equal(shouldUseCms({ hostname: "127.0.0.1", search: "?cms-preview=1" }), true);
assert.equal(shouldUseCms({ hostname: "127.0.0.1", search: "" }), false);

console.log("CMS synchronization data checks passed.");
