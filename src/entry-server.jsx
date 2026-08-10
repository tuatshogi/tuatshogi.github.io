import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { getPublishedNotice, publishedNotices } from "./data/notices";

export function render(page, articleId) {
  return renderToString(
    <StrictMode>
      <App
        page={page}
        notices={publishedNotices}
        notice={articleId ? getPublishedNotice(articleId) : undefined}
      />
    </StrictMode>,
  );
}
