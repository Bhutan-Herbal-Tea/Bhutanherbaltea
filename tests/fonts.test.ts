import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { DRUK_JA } from "../src/data/site.ts";
import { DZONGKHA_SUBSET_TEXT } from "../scripts/dzongkha-font.mjs";

const fontFile = join(process.cwd(), "src", "app", "fonts", "noto-serif-tibetan-subset.woff2");
const layout = readFileSync(join(process.cwd(), "src", "app", "layout.tsx"), "utf8");

// The full Noto Serif Tibetan download is ~714 KB; the hero only needs a handful of glyphs.
test("the Dzongkha font is a small local subset, not the full Google font", () => {
  assert.ok(existsSync(fontFile), "run npm run assets:dzongkha");
  assert.ok(statSync(fontFile).size < 20_000, `subset is ${statSync(fontFile).size} bytes`);
  assert.doesNotMatch(layout, /Noto_Serif_Tibetan/);
  assert.match(layout, /noto-serif-tibetan-subset\.woff2/);
});

test("the subset covers every character the site shows in Dzongkha", () => {
  for (const char of DRUK_JA) assert.ok(DZONGKHA_SUBSET_TEXT.includes(char), `missing ${char}`);
});
