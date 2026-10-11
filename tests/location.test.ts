import { test } from "node:test";
import assert from "node:assert/strict";
import { facts, FARM_PLACE, FARM_VILLAGE, PLATE_PLACE, SITE_DESCRIPTION } from "../src/data/site.ts";
import { teas } from "../src/data/teas.ts";
import { stages, storyPage } from "../src/data/story.ts";
import { farmSteps, grownPage } from "../src/data/grown.ts";
import { homeCopy, teasPage } from "../src/data/pages.ts";

// The herbs grow in Bumthang (user, 2026-10-10). Thimphu is only where the founders met again in 2015.
test("the farm is placed in Bumthang", () => {
  assert.equal(FARM_PLACE, "Bumthang");
  assert.match(PLATE_PLACE, /^Bumthang/);
  assert.match(homeCopy.hero.place, /^Bumthang/);
  assert.match(SITE_DESCRIPTION, /Bumthang/);
  for (const tea of teas) {
    assert.match(tea.description, /Bumthang/, tea.slug);
  }
});

test("the place-story pages name the village exactly as the client spells it", () => {
  assert.equal(FARM_VILLAGE, "Damphel Chokorteo / Shingkhar");
  const altitude = stages.find((stage) => stage.id === "altitude")!;
  assert.ok(altitude.body.includes(FARM_VILLAGE), "Our Story altitude stage");
  assert.ok(storyPage.summit.body.includes(FARM_VILLAGE), "Our Story summit");
  assert.ok(JSON.stringify(farmSteps).includes(FARM_VILLAGE), "How It's Grown farm-to-cup steps");
});

test("Thimphu appears only in the 2015 reunion stage", () => {
  const reunion = stages.find((stage) => stage.id === "thimphu")!;
  const elsewhere = JSON.stringify({
    facts,
    teas,
    storyPage,
    stages: stages.filter((stage) => stage.id !== "thimphu"),
    grownPage,
    farmSteps,
    homeCopy,
    teasPage,
  });
  assert.doesNotMatch(elsewhere, /Thimphu/);
  assert.match(reunion.body, /Thimphu/);
});
