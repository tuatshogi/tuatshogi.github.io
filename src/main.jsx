import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
const page = rootElement.dataset.page || "home";
const application = (
  <React.StrictMode>
    <App page={page} />
  </React.StrictMode>
);

if (rootElement.childElementCount > 0) {
  hydrateRoot(rootElement, application);
} else {
  createRoot(rootElement).render(application);
}
