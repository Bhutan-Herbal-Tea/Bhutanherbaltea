import { test } from "node:test";
import assert from "node:assert/strict";
import { cn } from "../src/lib/utils.ts";

test("cn treats the custom text sizes as sizes, not colours", () => {
  for (const size of ["text-display", "text-title", "text-lead"]) {
    assert.equal(cn("text-mist", size), `text-mist ${size}`);
  }
  assert.equal(cn("text-title", "text-display"), "text-display");
});
