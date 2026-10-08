import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { contact, heroPhoto, nav, SUMMIT_ALTITUDE_M, type Photo } from "../src/data/site.ts";
import { featuredTeas, getTea, otherTeas, teas } from "../src/data/teas.ts";
import { stages, storyPage } from "../src/data/story.ts";
import { grownPage, people, practices } from "../src/data/grown.ts";
import { contactPage, homeCopy, notFoundCopy, teaDetailCopy, teasPage } from "../src/data/pages.ts";

const allContent = { contact, heroPhoto, nav, teas, stages, storyPage, grownPage, people, practices, contactPage, homeCopy, notFoundCopy, teaDetailCopy, teasPage };

function collectPhotos(value: unknown, found: Photo[] = []): Photo[] {
  if (Array.isArray(value)) value.forEach((v) => collectPhotos(v, found));
  else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.src === "string" && typeof record.alt === "string") found.push(record as Photo);
    Object.values(record).forEach((v) => collectPhotos(v, found));
  }
  return found;
}

test("the five teas from the source article, in order", () => {
  assert.deepEqual(
    teas.map((t) => t.name),
    ["Chamomile", "Peppermint", "Lemon Verbena", "Sea Buckthorn", "Hypericum"],
  );
});

test("tea slugs are unique kebab-case", () => {
  const slugs = teas.map((t) => t.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z]+(-[a-z]+)*$/);
});

test("featured teas are the three Brand Bhutan certified teas", () => {
  assert.deepEqual(featuredTeas.map((t) => t.slug), ["chamomile", "peppermint", "lemon-verbena"]);
});

test("getTea and otherTeas", () => {
  assert.equal(getTea("peppermint")?.name, "Peppermint");
  assert.equal(getTea("green-tea"), undefined);
  const others = otherTeas("peppermint");
  assert.equal(others.length, 4);
  assert.ok(others.every((t) => t.slug !== "peppermint"));
});

test("benefits stay empty until the client approves wording (update this test when they do)", () => {
  for (const tea of teas) assert.deepEqual(tea.benefits, [], tea.name);
});

test("every image referenced in content exists in public/ and has alt text", () => {
  const photos = [...collectPhotos(allContent), ...teas.map((t) => ({ src: t.image, alt: t.name }))];
  assert.ok(photos.length >= 20, `expected at least 20 photos, found ${photos.length}`);
  for (const photo of photos) {
    assert.ok(existsSync(join(process.cwd(), "public", photo.src)), `missing file ${photo.src}`);
    assert.ok(photo.alt.trim().length > 0, `empty alt for ${photo.src}`);
  }
});

test("the summit altitude matches the source article", () => {
  assert.equal(SUMMIT_ALTITUDE_M, 2750);
});

test("no Bumthang references remain in content", () => {
  assert.doesNotMatch(JSON.stringify(allContent), /bumthang/i);
});

test("the story has at least four stages, each with a heading and body", () => {
  assert.ok(stages.length >= 4);
  for (const stage of stages) {
    assert.ok(stage.heading.length > 0 && stage.body.length > 0, stage.id);
  }
});
