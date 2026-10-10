import { test } from "node:test";
import assert from "node:assert/strict";
import { facts, FARM_PLACE, PLATE_PLACE, SITE_DESCRIPTION } from "../src/data/site.ts";
import { teas } from "../src/data/teas.ts";
import { stages, storyPage } from "../src/data/story.ts";
import { grownPage, practices } from "../src/data/grown.ts";
import { homeCopy, teasPage } from "../src/data/pages.ts";

// The herbs grow in Bumthang (user, 2026-10-10). Thimphu is only where the founders met again in 2015.
test("the farm is placed in Bumthang", () => {
  assert.equal(FARM_PLACE, "Bumthang");
  assert.match(PLATE_PLACE, /^Bumthang/);
  assert.match(homeCopy.hero.place, /^Bumthang/);
  assert.match(SITE_DESCRIPTION, /Bumthang/);
  for (const tea of teas) {
    assert.match(tea.shortDescription, /Bumthang/, tea.slug);
    assert.match(tea.description, /Bumthang/, tea.slug);
  }
});

test("Thimphu appears only in the 2015 reunion stage", () => {
  const reunion = stages.find((stage) => stage.id === "thimphu")!;
  const elsewhere = JSON.stringify({
    facts,
    teas,
    storyPage,
    stages: stages.filter((stage) => stage.id !== "thimphu"),
    grownPage,
    practices,
    homeCopy,
    teasPage,
  });
  assert.doesNotMatch(elsewhere, /Thimphu/);
  assert.match(reunion.body, /Thimphu/);
});
