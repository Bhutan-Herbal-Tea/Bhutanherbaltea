import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

test("the stylesheet no longer defines slanted, notched or parallelogram geometry", () => {
  assert.doesNotMatch(css, /@utility (slant-|notch|parallelogram)/);
  assert.doesNotMatch(css, /mist-layer/);
  assert.doesNotMatch(css, /to bottom right/, "no diagonal colour splits");
});

test("the stylesheet defines the Herbarium devices", () => {
  assert.match(css, /\.plate-tape/);
  assert.match(css, /\.ticker-track/);
  assert.match(css, /@utility flag-sweep/);
  assert.match(css, /--color-forest:\s*#1e3a2b/);
});

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(tsx|ts)$/.test(entry.name) ? [path] : [];
  });
}

test("no component uses the removed slanted, notched or wipe-reveal geometry", () => {
  const offenders = sourceFiles(join(process.cwd(), "src")).filter((file) =>
    /\bslant-(top|bottom|both)\b|\bparallelogram\b|["'\s]notch["'\s]|ImageReveal|--slant|rotate-\[-34deg\]/.test(
      readFileSync(file, "utf8"),
    ),
  );
  assert.deepEqual(offenders, []);
  assert.equal(existsSync(join(process.cwd(), "src", "components", "ui", "ImageReveal.tsx")), false);
});
