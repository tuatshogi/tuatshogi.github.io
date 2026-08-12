function isSafePath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return false;
  }

  try {
    const decoded = decodeURIComponent(value);
    return !/[\u0000-\u001f\u007f\\]/.test(decoded) &&
      !decoded.split(/[/?#]/).includes("..") &&
      !decoded.split("/").includes(".");
  } catch {
    return false;
  }
}

export function isSafeNoticeUrl(value) {
  if (isSafePath(value)) return true;
  if (typeof value !== "string" || /[\u0000-\u001f\u007f]/.test(value)) return false;

  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username && !url.password;
  } catch {
    return false;
  }
}

export function sortNoticesByPublishedAt(items) {
  return items.toSorted((a, b) =>
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt) ||
    a.id.localeCompare(b.id),
  );
}

export function sortRecordsByPublishedAt(items) {
  return items.toSorted((a, b) =>
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt) ||
    a.sortOrder - b.sortOrder ||
    a.year.localeCompare(b.year, "ja"),
  );
}

export function isPublicationDue(publishedAt, now = Date.now()) {
  const timestamp = Date.parse(publishedAt);
  return Number.isFinite(timestamp) && timestamp <= now;
}

export function noticeHref(id) {
  return `/news.html?id=${encodeURIComponent(id)}`;
}
