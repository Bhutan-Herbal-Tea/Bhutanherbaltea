"use client";

import { Moon, Sun } from "lucide-react";
import { nextTheme, THEME_STORAGE_KEY } from "@/lib/theme";

// The icon is chosen by CSS (dark: variant), so server and client render the same markup.
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const theme = nextTheme(root.dataset.theme);
    root.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className="inline-flex size-11 items-center justify-center text-foreground transition-colors hover:bg-foreground/10"
    >
      <Moon className="size-5 dark:hidden" aria-hidden />
      <Sun className="hidden size-5 dark:block" aria-hidden />
    </button>
  );
}
