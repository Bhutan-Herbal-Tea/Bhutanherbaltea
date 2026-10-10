export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "bht-theme";

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return prefersDark ? "dark" : "light";
}

export function nextTheme(current: string | undefined): Theme {
  return current === "dark" ? "light" : "dark";
}

// Runs in <head> before first paint. Mirrors resolveTheme; tests/theme.test.ts keeps them in step.
// It also removes blank text nodes from <head>: Netlify injects "\n<!-- hosted on Netlify -->" after
// <meta charset>, and that stray newline makes React's hydration fail and re-render the whole page.
export const themeInitScript = `(function(){var s=null;try{s=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}var d=false;try{d=window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){}document.documentElement.dataset.theme=(s==="light"||s==="dark")?s:(d?"dark":"light");var h=document.head;if(h){var n=Array.prototype.slice.call(h.childNodes);for(var i=0;i<n.length;i++){if(n[i].nodeType===3&&!n[i].textContent.trim())n[i].remove()}}})();`;
