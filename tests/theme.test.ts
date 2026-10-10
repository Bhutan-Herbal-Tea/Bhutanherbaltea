import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { nextTheme, resolveTheme, THEME_STORAGE_KEY, themeInitScript } from "../src/lib/theme.ts";

type FakeNode = { nodeType: number; textContent: string; removed?: boolean; remove: () => void };

function fakeNode(nodeType: number, textContent = ""): FakeNode {
  const node: FakeNode = { nodeType, textContent, remove: () => { node.removed = true; } };
  return node;
}

function runInitScript(
  stored: string | null,
  prefersDark: boolean,
  storageBlocked = false,
  headNodes: FakeNode[] = [],
) {
  const root = { dataset: {} as Record<string, string> };
  const context = {
    localStorage: {
      getItem: (key: string) => {
        if (storageBlocked) throw new Error("storage blocked");
        return key === THEME_STORAGE_KEY ? stored : null;
      },
    },
    window: { matchMedia: () => ({ matches: prefersDark }) },
    document: { documentElement: root, head: { childNodes: headNodes } },
  };
  vm.runInNewContext(themeInitScript, context);
  return root.dataset.theme;
}

test("the inline script removes blank text nodes a host injects into <head> before hydration", () => {
  // Netlify inserts "\n<!-- This site is hosted on Netlify ... -->" after <meta charset>;
  // the newline text node makes React's hydration of <head> fail.
  const meta = fakeNode(1);
  const newline = fakeNode(3, "\n");
  const comment = fakeNode(8, " This site is hosted on Netlify ");
  const realText = fakeNode(3, "keep me");
  runInitScript(null, false, false, [meta, newline, comment, realText]);
  assert.equal(newline.removed, true, "blank text node removed");
  assert.equal(meta.removed, undefined, "elements kept");
  assert.equal(comment.removed, undefined, "comments kept (React ignores them)");
  assert.equal(realText.removed, undefined, "non-blank text kept");
});

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
