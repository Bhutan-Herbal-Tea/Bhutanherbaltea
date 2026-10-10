import { test } from "node:test";
import assert from "node:assert/strict";
import { stageLayout } from "../src/lib/story.ts";

test("split stages alternate sides, then a full-bleed break", () => {
  assert.equal(stageLayout(0), "image-left");
  assert.equal(stageLayout(1), "image-right");
  assert.equal(stageLayout(2), "full-bleed");
  assert.equal(stageLayout(3), "image-left");
});

test("never more than two image+text splits in a row", () => {
  let run = 0;
  for (let i = 0; i < 12; i++) {
    run = stageLayout(i) === "full-bleed" ? 0 : run + 1;
    assert.ok(run <= 2, `three splits in a row ending at stage ${i}`);
  }
});
