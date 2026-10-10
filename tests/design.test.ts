import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

test("the stylesheet no longer defines slanted, notched or parallelogram geometry", () => {
  assert.doesNotMatch(css, /@utility (slant-|notch|parallelogram)/);
  assert.doesNotMatch(css, /mist-layer/);
});

test("the stylesheet defines the Herbarium devices", () => {
  assert.match(css, /\.plate-tape/);
  assert.match(css, /\.ticker-track/);
  assert.match(css, /@utility flag-sweep/);
  assert.match(css, /--color-forest:\s*#1e3a2b/);
});
