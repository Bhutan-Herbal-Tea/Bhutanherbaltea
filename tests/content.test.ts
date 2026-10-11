import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { contact, DRUK_JA, facts, heroPhoto, nav, SUMMIT_ALTITUDE_M, TAGLINE, type Photo } from "../src/data/site.ts";
import { featuredTeas, getTea, otherTeas, teas } from "../src/data/teas.ts";
import { LUNGTA_COLORS, stages, storyPage } from "../src/data/story.ts";
import { certifications, farmSteps, grownPage, people } from "../src/data/grown.ts";
import { contactPage, homeCopy, notFoundCopy, teaDetailCopy, teasPage } from "../src/data/pages.ts";

const allContent = { contact, facts, heroPhoto, nav, teas, stages, storyPage, grownPage, people, farmSteps, certifications, contactPage, homeCopy, notFoundCopy, teaDetailCopy, teasPage };

function collectPhotos(value: unknown, found: Photo[] = []): Photo[] {
  if (Array.isArray(value)) value.forEach((v) => collectPhotos(v, found));
  else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.src === "string" && typeof record.alt === "string") found.push(record as Photo);
    Object.values(record).forEach((v) => collectPhotos(v, found));
  }
  return found;
}

test("tea slugs are unique kebab-case", () => {
  const slugs = teas.map((t) => t.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z]+(-[a-z]+)*$/);
});

test("featured teas are the three Brand Bhutan certified teas", () => {
  assert.deepEqual(featuredTeas.map((t) => t.slug), ["chamomile", "mint", "lemon-verbena"]);
});

test("getTea and otherTeas", () => {
  assert.equal(getTea("mint")?.name, "Mint");
  assert.equal(getTea("green-tea"), undefined);
  // The next three teas in catalogue order, wrapping round, so every tea is suggested somewhere
  // and the row never leaves a lone card.
  assert.deepEqual(otherTeas("mint").map((t) => t.slug), ["lemon-verbena", "himalayan-sea-berry", "chrysanthemum"]);
  assert.deepEqual(otherTeas("hypericum").map((t) => t.slug), ["chamomile", "mint", "lemon-verbena"]);
});

test("benefits stay empty until the client approves wording (update this test when they do)", () => {
  for (const tea of teas) assert.deepEqual(tea.benefits, [], tea.name);
});

test("every image referenced in content exists in public/ and has alt text", () => {
  const photos = [...collectPhotos(allContent), ...teas.map((t) => ({ src: t.image, alt: t.imageAlt }))];
  assert.ok(photos.length >= 20, `expected at least 20 photos, found ${photos.length}`);
  for (const photo of photos) {
    assert.ok(existsSync(join(process.cwd(), "public", photo.src)), `missing file ${photo.src}`);
    assert.ok(photo.alt.trim().length > 0, `empty alt for ${photo.src}`);
  }
});

test("the summit altitude matches the source article", () => {
  assert.equal(SUMMIT_ALTITUDE_M, 2750);
});

test("no em or en dashes in any visible content", () => {
  assert.doesNotMatch(JSON.stringify(allContent), /[–—]/);
});

test("every story stage has a heading, body and marker", () => {
  assert.ok(stages.length >= 4);
  for (const stage of stages) {
    assert.ok(stage.heading && stage.body && stage.marker, stage.id);
  }
});

test("one label per CTA intent", () => {
  assert.equal(homeCopy.hero.ctaLabel, "Discover our story");
  assert.equal(homeCopy.why.linkLabel, homeCopy.hero.ctaLabel);
  assert.equal(homeCopy.hero.teasLabel, "See all teas");
  assert.equal(homeCopy.featured.linkLabel, "See all teas");
  assert.equal(storyPage.summit.teasLabel, "See all teas");
  assert.equal(notFoundCopy.teasLabel, "See all teas");
  assert.equal(homeCopy.contactPanel.linkLabel, "Contact");
});

test("lungta has the five element colours in traditional order", () => {
  assert.deepEqual(
    LUNGTA_COLORS.map((c) => c.name),
    ["blue", "white", "red", "green", "yellow"],
  );
});

test("home hero subtext stays within 20 words", () => {
  assert.ok(homeCopy.hero.subtext.split(/\s+/).length <= 20);
});

test("the facts band shows the five sourced facts", () => {
  assert.deepEqual(facts.map((f) => f.value), ["2016", "2,750 m", "6", "3", "1st"]);
  for (const fact of facts) assert.ok(fact.label.length > 0);
});

test("the Dzongkha accent reads Druk ja, Bhutanese tea", () => {
  // འབྲུག་ཇ། as escapes, so a non-UTF-8 editor can't mangle it.
  assert.equal(DRUK_JA, "\u0F60\u0F56\u0FB2\u0F74\u0F42\u0F0B\u0F47\u0F0D");
});

test("the home headline joins back into the brand tagline", () => {
  assert.equal(`${homeCopy.hero.title.lead} ${homeCopy.hero.title.accent}`, TAGLINE);
});

test("the hero plate label states brand facts, not a claim about the stand-in photo", () => {
  assert.deepEqual(homeCopy.hero.plateLabel, ["Bhutan Herbal Tea", "Est. 2016"]);
});

test("why altitude has three rows, each with a title and body", () => {
  assert.equal(homeCopy.why.rows.length, 3);
  for (const row of homeCopy.why.rows) assert.ok(row.title && row.body);
});
