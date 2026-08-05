import "./index.css";

const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNavigation = document.getElementById("mobile-navigation");

if (menuToggle && mobileNavigation) {
  const desktopQuery = window.matchMedia("(min-width: 768px)");
  const menuLinks = mobileNavigation.querySelectorAll("[data-menu-link]");

  const isMenuOpen = () => menuToggle.getAttribute("aria-expanded") === "true";

  const setMenuOpen = (open, { restoreFocus = false } = {}) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileNavigation.setAttribute("aria-hidden", String(!open));
    mobileNavigation.inert = !open;
    mobileNavigation.classList.toggle("visible", open);
    mobileNavigation.classList.toggle("max-h-96", open);
    mobileNavigation.classList.toggle("invisible", !open);
    mobileNavigation.classList.toggle("max-h-0", !open);

    if (!open && restoreFocus) {
      menuToggle.focus();
    }
  };

  menuToggle.addEventListener("click", () => setMenuOpen(!isMenuOpen()));

  for (const link of menuLinks) {
    link.addEventListener("click", () => setMenuOpen(false));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenuOpen(false, { restoreFocus: true });
    }
  });

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
}
