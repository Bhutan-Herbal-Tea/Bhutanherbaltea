import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const IMAGES = join(process.cwd(), "public", "images");

function photos(dir = IMAGES): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return photos(path);
    // The client's source logo lives at the top level and is not a stand-in photo.
    return dir !== IMAGES && entry.name.endsWith(".jpg") ? [relative(IMAGES, path).replaceAll("\\", "/")] : [];
  });
}

test("every stand-in photo is credited in CREDITS.md", () => {
  const credits = join(IMAGES, "CREDITS.md");
  assert.ok(existsSync(credits), "public/images/CREDITS.md is missing");
  const text = readFileSync(credits, "utf8");
  const files = photos();
  assert.equal(files.length, 21);
  for (const file of files) assert.ok(text.includes(`\`${file}\``), `${file} is not credited`);
});

test("the hero photo stays under 300 KB and no photo exceeds 450 KB", () => {
  assert.ok(statSync(join(IMAGES, "hero", "terraced-fields.jpg")).size <= 300 * 1024, "hero over 300 KB");
  for (const file of photos()) {
    assert.ok(statSync(join(IMAGES, file)).size <= 450 * 1024, `${file} over 450 KB`);
  }
});
