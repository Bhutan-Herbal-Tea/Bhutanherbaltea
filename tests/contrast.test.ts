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

const INK = "#0e0e0c";
const MIST = "#f4f1ea";
const SAFFRON = "#f2c230";
const ORANGE = "#e86a1c";
const MUTED_LIGHT = "#4f4c46";
const MUTED_DARK = "#afada7";

test("contrast helper matches the WCAG reference", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21);
});

test("light theme text pairs pass WCAG AA", () => {
  assert.ok(contrast(INK, MIST) >= 7, "body text");
  assert.ok(contrast(MUTED_LIGHT, MIST) >= 7, "muted text");
  assert.ok(contrast(INK, MIST) >= 3, "focus ring (ink)");
});

test("dark theme text pairs pass WCAG AA", () => {
  assert.ok(contrast(MIST, INK) >= 7, "body text");
  assert.ok(contrast(MUTED_DARK, INK) >= 7, "muted text");
  assert.ok(contrast(SAFFRON, INK) >= 4.5, "accent text");
});

test("buttons and the flag panel keep ink text readable", () => {
  assert.ok(contrast(INK, ORANGE) >= 4.5, "primary button");
  assert.ok(contrast(INK, SAFFRON) >= 4.5, "primary hover and flag panel saffron half");
  assert.ok(contrast(MIST, INK) >= 4.5, "ink button");
});

test("saffron is never accent text in the light theme", () => {
  assert.ok(contrast(SAFFRON, MIST) < 3, "this is why light uses ink for accent text");
  assert.match(css, /--accent-text:\s*#0e0e0c/, "light accent-text must be ink");
});

test("globals.css declares the tested token values", () => {
  assert.match(css, new RegExp(`--muted-foreground:\\s*${MUTED_LIGHT}`));
  assert.match(css, new RegExp(`--muted-foreground:\\s*${MUTED_DARK}`));
  assert.match(css, /--accent-text:\s*#f2c230/);
  assert.match(css, /--ring:\s*#0e0e0c/);
  assert.match(css, /--ring:\s*#f2c230/);
});
