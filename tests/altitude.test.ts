import { test } from "node:test";
import assert from "node:assert/strict";
import { altitudeAt, formatAltitude } from "../src/lib/altitude.ts";

test("altitudeAt maps scroll progress to metres", () => {
  assert.equal(altitudeAt(0, 2750), 0);
  assert.equal(altitudeAt(0.5, 2750), 1375);
  assert.equal(altitudeAt(1, 2750), 2750);
});

test("altitudeAt clamps out-of-range and invalid progress", () => {
  assert.equal(altitudeAt(-0.2, 2750), 0);
  assert.equal(altitudeAt(1.4, 2750), 2750);
  assert.equal(altitudeAt(Number.NaN, 2750), 0);
});

test("formatAltitude uses thousands separators and metres", () => {
  assert.equal(formatAltitude(0), "0 m");
  assert.equal(formatAltitude(2750), "2,750 m");
});
