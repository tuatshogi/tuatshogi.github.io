import {
  isPublicationDue,
  isSafeNoticeUrl,
  sortNoticesByPublishedAt,
  sortRecordsByPublishedAt,
} from "./publication.js";

export const cmsSnapshotUrl = "https://mycraft-cms.tuatshogi.workers.dev/api/public/snapshot";
export const cmsNoticesUrl = "https://mycraft-cms.tuatshogi.workers.dev/api/public/notices";
export const cmsRecordsUrl = "https://mycraft-cms.tuatshogi.workers.dev/api/public/records";
export const cmsRefreshIntervalMs = 300_000;

const idPattern = /^[A-Za-z0-9_-]{1,64}$/;
const controlPattern = /[\u0000-\u001f\u007f]/;

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}: must be an object`);
  }
  return value;
}

function string(value, label, maxLength, { allowEmpty = false, allowFormatting = false } = {}) {
  const unsafeControl = allowFormatting
    ? /[\u0000\u000b\u000c\u000e-\u001f\u007f]/.test(value ?? "")
    : controlPattern.test(value ?? "");
  if (
    typeof value !== "string" ||
    value.length > maxLength ||
    (!allowEmpty && !value.trim()) ||
    unsafeControl
  ) {
    throw new Error(`${label}: is invalid`);
  }
  return value;
}

function dateTime(value, label) {
  const result = string(value, label, 40);
  if (!Number.isFinite(Date.parse(result))) throw new Error(`${label}: is invalid`);
  return new Date(result).toISOString();
}

function integer(value, label, fallback = 0) {
  if (value === undefined) return fallback;
  if (!Number.isInteger(value) || value < -1_000_000 || value > 1_000_000) {
    throw new Error(`${label}: is invalid`);
  }
  return value;
}

function safeUrl(value, label, { required = false } = {}) {
  if (value === undefined || value === null || value === "") {
    if (required) throw new Error(`${label}: is required`);
    return undefined;
  }
  const result = string(value, label, 2048);
  if (!isSafeNoticeUrl(result)) throw new Error(`${label}: is invalid`);
  return result;
}

function assetUrl(value, label) {
  const path = string(value, label, 2048);
  if (isSafeNoticeUrl(path)) return path;
  if (
    path.startsWith("/") ||
    path.includes("\\") ||
    path.split("/").some((part) => part === "." || part === "..")
  ) {
    throw new Error(`${label}: is invalid`);
  }
  return `/${path}`;
}

function attachment(value, noticeIndex, attachmentIndex) {
  const label = `notices[${noticeIndex}].attachments[${attachmentIndex}]`;
  const item = object(value, label);
  if (typeof item.id !== "string" || !idPattern.test(item.id)) {
    throw new Error(`${label}.id: is invalid`);
  }
  if (item.expired === true) {
    return {
      id: item.id,
      path: "",
      alt: string(item.alt, `${label}.alt`, 1000),
      mimeType: item.mimeType,
      sizeBytes: Number.isInteger(item.sizeBytes) && item.sizeBytes >= 0 ? item.sizeBytes : 0,
      width: Number.isInteger(item.width) && item.width > 0 ? item.width : 1,
      height: Number.isInteger(item.height) && item.height > 0 ? item.height : 1,
      expired: true,
      responsive: {},
    };
  }
  if (!/^image\/(?:jpeg|png|webp)$/i.test(item.mimeType)) {
    throw new Error(`${label}.mimeType: is invalid`);
  }
  for (const field of ["sizeBytes", "width", "height"]) {
    if (!Number.isInteger(item[field]) || item[field] < (field === "sizeBytes" ? 0 : 1)) {
      throw new Error(`${label}.${field}: is invalid`);
    }
  }
  const responsive = object(item.responsive ?? {}, `${label}.responsive`);
  return {
    id: item.id,
    path: assetUrl(item.path, `${label}.path`),
    alt: string(item.alt, `${label}.alt`, 1000),
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes,
    width: item.width,
    height: item.height,
    expired: false,
    responsive: Object.fromEntries(
      Object.entries(responsive).map(([format, path]) => {
        if (!/^[a-z0-9.+-]+$/i.test(format)) throw new Error(`${label}.responsive: is invalid`);
        return [format, assetUrl(path, `${label}.responsive.${format}`)];
      }),
    ),
  };
}

function notice(value, index) {
  const label = `notices[${index}]`;
  const item = object(value, label);
  if (typeof item.id !== "string" || !idPattern.test(item.id)) {
    throw new Error(`${label}.id: is invalid`);
  }
  if (!Array.isArray(item.attachments)) throw new Error(`${label}.attachments: must be an array`);
  return {
    id: item.id,
    title: string(item.title, `${label}.title`, 240),
    body: string(item.body, `${label}.body`, 100_000, { allowEmpty: true, allowFormatting: true }),
    linkUrl: safeUrl(item.linkUrl, `${label}.linkUrl`),
    published: true,
    publishedAt: dateTime(item.publishedAt, `${label}.publishedAt`),
    sortOrder: integer(item.sortOrder, `${label}.sortOrder`),
    attachments: item.attachments.map((entry, attachmentIndex) => attachment(entry, index, attachmentIndex)),
  };
}

function recordDate(value, label) {
  const result = string(value, label, 10);
  const match = result.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!match) throw new Error(`${label}: is invalid`);
  const parsed = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== Number(match[1]) ||
    parsed.getUTCMonth() + 1 !== Number(match[2]) ||
    parsed.getUTCDate() !== Number(match[3])
  ) {
    throw new Error(`${label}: is invalid`);
  }
  return result;
}

function record(value, index) {
  const label = `records[${index}]`;
  const item = object(value, label);
  if (!Array.isArray(item.items)) throw new Error(`${label}.items: must be an array`);
  return {
    year: string(item.year, `${label}.year`, 120),
    sourceUrl: safeUrl(item.sourceUrl, `${label}.sourceUrl`, { required: true }),
    publishedAt: dateTime(item.publishedAt, `${label}.publishedAt`),
    sortOrder: integer(item.sortOrder, `${label}.sortOrder`),
    items: item.items.map((entry, itemIndex) => {
      const itemLabel = `${label}.items[${itemIndex}]`;
      const recordItem = object(entry, itemLabel);
      if (recordItem.highlight !== undefined && typeof recordItem.highlight !== "boolean") {
        throw new Error(`${itemLabel}.highlight: is invalid`);
      }
      return {
        date: recordDate(recordItem.date, `${itemLabel}.date`),
        event: string(recordItem.event, `${itemLabel}.event`, 240),
        result: string(recordItem.result, `${itemLabel}.result`, 240),
        detail: string(recordItem.detail, `${itemLabel}.detail`, 2000, { allowEmpty: true, allowFormatting: true }),
        ...(recordItem.highlight ? { highlight: true } : {}),
      };
    }),
  };
}

function unique(items, key, label) {
  const values = new Set();
  for (const item of items) {
    if (values.has(item[key])) throw new Error(`${label}: duplicate ${key}`);
    values.add(item[key]);
  }
  return items;
}

export function normalizeCmsSnapshot(value, { now = Date.now() } = {}) {
  const snapshot = object(value, "snapshot");
  if (!Array.isArray(snapshot.notices) || !Array.isArray(snapshot.records)) {
    throw new Error("snapshot: notices and records must be arrays");
  }
  const notices = unique(snapshot.notices.map(notice), "id", "notices")
    .filter((item) => isPublicationDue(item.publishedAt, now));
  const records = unique(snapshot.records.map(record), "year", "records")
    .filter((item) => isPublicationDue(item.publishedAt, now));
  return {
    notices: sortNoticesByPublishedAt(notices),
    records: sortRecordsByPublishedAt(records),
  };
}

async function fetchCmsJson(path, { fetchImpl = globalThis.fetch, timeoutMs = 8000 } = {}) {
  if (typeof fetchImpl !== "function") throw new Error("CMS fetch is unavailable");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(path, {
      method: "GET",
      headers: { accept: "application/json" },
      credentials: "omit",
      cache: "default",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`CMS request failed (${response.status})`);
    if (!(response.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
      throw new Error("CMS response is not JSON");
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchCmsSnapshot(options = {}) {
  const root = globalThis.document?.getElementById("root");
  const page = root?.dataset.page ?? "home";
  const locationValue = globalThis.location;
  const queryId = locationValue && new URLSearchParams(locationValue.search).get("id");
  const pathId = locationValue?.pathname.match(/^\/news\/([A-Za-z0-9_-]{1,64})\.html$/)?.[1];
  const noticeId = queryId && idPattern.test(queryId) ? queryId : pathId;
  const detail = (page === "notice" || (page === "news" && noticeId)) && noticeId;
  const path = page === "home" ? cmsSnapshotUrl :
    page === "record" ? cmsRecordsUrl : cmsNoticesUrl + (detail ? `/${encodeURIComponent(noticeId)}` : "");
  const value = await fetchCmsJson(path, options);
  if (page === "home") return normalizeCmsSnapshot(value);
  return normalizeCmsSnapshot({
    notices: page === "record" ? [] : detail ? [value.notice] : value.notices,
    records: page === "record" ? value.records : [],
  });
}

export function shouldUseCms(locationValue = globalThis.location) {
  if (!locationValue) return false;
  return locationValue.hostname === "tuatshogi.github.io" ||
    new URLSearchParams(locationValue.search).get("cms-preview") === "1";
}
