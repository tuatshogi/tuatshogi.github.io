import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export function render(page) {
  return renderToString(
    <StrictMode>
      <App page={page} />
    </StrictMode>,
  );
}
