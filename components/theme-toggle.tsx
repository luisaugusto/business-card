"use client";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const current = root.dataset.theme ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = current === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("luis-card-theme", next); } catch { /* Theme still works without storage. */ }
  }
  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle color theme">
      <span className="label-for-dark">Light</span>
      <span className="label-for-light">Dark</span>
    </button>
  );
}
