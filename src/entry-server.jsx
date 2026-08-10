import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { getPublishedNotice, publishedNotices } from "./data/notices";
import { records } from "./data/records";

export function render(page, articleId) {
  return renderToString(
    <StrictMode>
      <App
        page={page}
        notices={publishedNotices}
        notice={articleId ? getPublishedNotice(articleId) : undefined}
        records={records}
      />
    </StrictMode>,
  );
}
