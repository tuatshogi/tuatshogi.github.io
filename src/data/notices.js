const idPattern = /^[A-Za-z0-9_-]+$/;

// CMS同期前は空配列にして、未承認の内容が公開されない状態を初期値にする。
export const notices = [];

function isValidDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

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

function validateAttachment(attachment, noticeIndex, attachmentIndex) {
  const label = `notices[${noticeIndex}].attachments[${attachmentIndex}]`;
  if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) {
    throw new Error(`${label}: must be an object`);
  }
  if (typeof attachment.id !== "string" || !idPattern.test(attachment.id)) {
    throw new Error(`${label}.id: must contain only letters, numbers, hyphens, or underscores`);
  }
  if (!isSafeNoticeUrl(attachment.path)) {
    throw new Error(`${label}.path: must be a safe absolute path or http(s) URL`);
  }
  if (typeof attachment.alt !== "string" || !attachment.alt.trim()) {
    throw new Error(`${label}.alt: is required`);
  }
  if (typeof attachment.mimeType !== "string" || !/^image\/(?:jpeg|png|webp)$/i.test(attachment.mimeType)) {
    throw new Error(`${label}.mimeType: is invalid`);
  }
  for (const dimension of ["width", "height"]) {
    if (!Number.isInteger(attachment[dimension]) || attachment[dimension] <= 0) {
      throw new Error(`${label}.${dimension}: must be a positive integer`);
    }
  }
  if (!Number.isInteger(attachment.sizeBytes) || attachment.sizeBytes < 0) {
    throw new Error(`${label}.sizeBytes: must be a non-negative integer`);
  }
  if (!attachment.responsive || typeof attachment.responsive !== "object" || Array.isArray(attachment.responsive)) {
    throw new Error(`${label}.responsive: must be an object`);
  }
  for (const [format, path] of Object.entries(attachment.responsive)) {
    if (!/^[a-z0-9.+-]+$/i.test(format) || !isSafeNoticeUrl(path)) {
      throw new Error(`${label}.responsive.${format}: must be a safe URL`);
    }
  }
}

export function validateNotices(items = notices) {
  if (!Array.isArray(items)) throw new Error("notices: must be an array");

  const ids = new Set();
  for (const [index, notice] of items.entries()) {
    const label = `notices[${index}]`;
    if (!notice || typeof notice !== "object" || Array.isArray(notice)) {
      throw new Error(`${label}: must be an object`);
    }
    if (typeof notice.id !== "string" || !idPattern.test(notice.id)) {
      throw new Error(`${label}.id: must contain only letters, numbers, hyphens, or underscores`);
    }
    if (ids.has(notice.id)) throw new Error(`${label}.id: duplicate id "${notice.id}"`);
    ids.add(notice.id);
    if (typeof notice.title !== "string" || !notice.title.trim()) throw new Error(`${label}.title: is required`);
    if (typeof notice.body !== "string") throw new Error(`${label}.body: is required`);
    if (/[\u0000\u000b\u000c\u000e-\u001f\u007f]/.test(notice.body)) throw new Error(`${label}.body: contains an unsafe control character`);
    if (typeof notice.published !== "boolean") throw new Error(`${label}.published: must be boolean`);
    if (!isValidDate(notice.publishedAt)) throw new Error(`${label}.publishedAt: must be a valid date`);
    if (!Number.isInteger(notice.sortOrder)) throw new Error(`${label}.sortOrder: must be an integer`);
    if (!isValidDate(notice.createdAt)) throw new Error(`${label}.createdAt: must be a valid date`);
    if (!isValidDate(notice.updatedAt)) throw new Error(`${label}.updatedAt: must be a valid date`);
    if (notice.linkUrl !== undefined && !isSafeNoticeUrl(notice.linkUrl)) {
      throw new Error(`${label}.linkUrl: must be a safe absolute path or http(s) URL`);
    }
    if (!Array.isArray(notice.attachments)) throw new Error(`${label}.attachments: must be an array`);
    notice.attachments.forEach((attachment, attachmentIndex) => validateAttachment(attachment, index, attachmentIndex));
  }
  return items;
}

validateNotices();

export const publishedNotices = notices
  .filter((notice) => notice.published)
  .toSorted((a, b) =>
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt) ||
    a.sortOrder - b.sortOrder ||
    a.id.localeCompare(b.id),
  );

export function getPublishedNotice(id) {
  return publishedNotices.find((notice) => notice.id === id);
}
