// Downloads a Noto Serif Tibetan subset holding only the glyphs the site shows in Dzongkha.
// The full font is ~714 KB; Google Fonts' `text=` parameter returns just what we need (a few KB).
// Re-run (npm run assets:dzongkha) whenever DRUK_JA in src/data/site.ts changes.
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { DRUK_JA } from "../src/data/site.ts";

export const DZONGKHA_SUBSET_TEXT = DRUK_JA;

// A modern browser user agent, so Google Fonts answers with woff2.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const OUT = join(process.cwd(), "src", "app", "fonts", "noto-serif-tibetan-subset.woff2");

async function main() {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Serif+Tibetan&text=${encodeURIComponent(DZONGKHA_SUBSET_TEXT)}`;
  const css = await (await fetch(cssUrl, { headers: { "User-Agent": UA } })).text();
  const fontUrl = css.match(/url\((https:\/\/[^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`No font URL in Google Fonts response:\n${css}`);
  const font = Buffer.from(await (await fetch(fontUrl, { headers: { "User-Agent": UA } })).arrayBuffer());
  await mkdir(join(OUT, ".."), { recursive: true });
  await writeFile(OUT, font);
  console.log(`Wrote ${OUT} (${font.length} bytes) for "${DZONGKHA_SUBSET_TEXT}"`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
