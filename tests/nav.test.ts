import { test } from "node:test";
import assert from "node:assert/strict";
import { isActive } from "../src/lib/nav.ts";

test("isActive matches the exact route and its children only", () => {
  assert.equal(isActive("/teas", "/teas"), true);
  assert.equal(isActive("/teas/peppermint", "/teas"), true);
  assert.equal(isActive("/teasing", "/teas"), false);
  assert.equal(isActive("/", "/teas"), false);
  assert.equal(isActive("/", "/"), true);
  assert.equal(isActive("/contact", "/"), false);
});
