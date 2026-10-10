import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { nextTheme, resolveTheme, THEME_STORAGE_KEY, themeInitScript } from "../src/lib/theme.ts";

function runInitScript(stored: string | null, prefersDark: boolean, storageBlocked = false) {
  const root = { dataset: {} as Record<string, string> };
  const context = {
    localStorage: {
      getItem: (key: string) => {
        if (storageBlocked) throw new Error("storage blocked");
        return key === THEME_STORAGE_KEY ? stored : null;
      },
    },
    window: { matchMedia: () => ({ matches: prefersDark }) },
    document: { documentElement: root },
  };
  vm.runInNewContext(themeInitScript, context);
  return root.dataset.theme;
}

test("resolveTheme prefers a valid stored choice, else the system setting", () => {
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme("purple", false), "light");
});

test("nextTheme flips between light and dark", () => {
  assert.equal(nextTheme("dark"), "light");
  assert.equal(nextTheme("light"), "dark");
  assert.equal(nextTheme(undefined), "dark");
});

test("the inline script applies the stored theme before paint", () => {
  assert.equal(runInitScript("dark", false), "dark");
  assert.equal(runInitScript("light", true), "light");
});

test("the inline script falls back to the system setting", () => {
  assert.equal(runInitScript(null, true), "dark");
  assert.equal(runInitScript(null, false), "light");
  assert.equal(runInitScript("dark", false, true), "light");
});
