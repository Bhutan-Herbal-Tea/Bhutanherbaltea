import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

const PAPER = "#f4f1ea";
const TEXT = "#14201a";
const FOREST = "#1e3a2b";
const DARK_BG = "#0f1712";
const MIST = "#f4f1ea";
const INK = "#0e0e0c";
const SAFFRON = "#f2c230";
const ORANGE = "#e86a1c";
const MUTED_LIGHT = "#4f4c46";
const MUTED_DARK = "#afada7";

test("contrast helper matches the WCAG reference", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21);
});

test("light theme text pairs pass WCAG AA", () => {
  assert.ok(contrast(TEXT, PAPER) >= 7, "body text");
  assert.ok(contrast(MUTED_LIGHT, PAPER) >= 7, "muted text");
  assert.ok(contrast(FOREST, PAPER) >= 7, "accent text, links and focus ring");
});

test("dark theme text pairs pass WCAG AA", () => {
  assert.ok(contrast(MIST, DARK_BG) >= 7, "body text");
  assert.ok(contrast(MUTED_DARK, DARK_BG) >= 7, "muted text");
  assert.ok(contrast(SAFFRON, DARK_BG) >= 4.5, "accent text");
});

test("buttons and forest panels keep their text readable", () => {
  assert.ok(contrast(MIST, FOREST) >= 7, "primary button, facts band, closing panel, footer");
  assert.ok(contrast(INK, SAFFRON) >= 4.5, "hover sweep, saffron half; dark primary button");
  assert.ok(contrast(INK, ORANGE) >= 4.5, "hover sweep, orange half");
  assert.ok(contrast(FOREST, MIST) >= 4.5, "light button on forest panels");
});

test("saffron and orange are never text on paper", () => {
  assert.ok(contrast(SAFFRON, PAPER) < 3);
  assert.ok(contrast(ORANGE, PAPER) < 3);
  assert.match(css, /--accent-text:\s*#1e3a2b/, "light accent-text must be forest");
});

test("globals.css declares the tested token values", () => {
  assert.match(css, /--background:\s*#f4f1ea/);
  assert.match(css, /--background:\s*#0f1712/);
  assert.match(css, /--foreground:\s*#14201a/);
  assert.match(css, new RegExp(`--muted-foreground:\\s*${MUTED_LIGHT}`));
  assert.match(css, new RegExp(`--muted-foreground:\\s*${MUTED_DARK}`));
  assert.match(css, /--accent-text:\s*#f2c230/);
  assert.match(css, /--ring:\s*#1e3a2b/);
  assert.match(css, /--ring:\s*#f2c230/);
});
