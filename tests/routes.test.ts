import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { nav } from "../src/data/site.ts";

test("every nav link points at an existing page", () => {
  for (const item of nav) {
    const page = join(process.cwd(), "src", "app", ...item.href.split("/").filter(Boolean), "page.tsx");
    assert.ok(existsSync(page), `missing ${page} for ${item.href}`);
  }
});
