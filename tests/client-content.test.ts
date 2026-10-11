import { test } from "node:test";
import assert from "node:assert/strict";
import { contact } from "../src/data/site.ts";
import { getTea, specialtyTeas, teas } from "../src/data/teas.ts";
import { certifications, farmSteps } from "../src/data/pages/grown.ts";
import { contactPage } from "../src/data/pages/contact.ts";
import { teaDetailCopy, teasPage } from "../src/data/pages/teas.ts";
import { mailtoHref, whatsappHref } from "../src/lib/contact.ts";

// Source: the client's own catalogue page (sent 2026-10-11).

test("the six single-herb teas from the client's catalogue, in their order", () => {
  assert.deepEqual(
    teas.map((t) => [t.slug, t.name, t.botanical]),
    [
      ["chamomile", "Chamomile", "Matricaria recutita"],
      ["mint", "Mint", "Mentha piperita"],
      ["lemon-verbena", "Lemon Verbena", "Aloysia triphylla"],
      ["himalayan-sea-berry", "Himalayan Sea-Berry", "Hippophae salicifolia"],
      ["chrysanthemum", "Chrysanthemum", "Chrysanthemum × morifolium"],
      ["hypericum", "Hypericum", "Hypericum perforatum"],
    ],
  );
});

test("every tea lists its pack and price from the catalogue", () => {
  assert.deepEqual(
    teas.map((t) => [t.pack, t.price]),
    [
      ["20 tea bags × 1 g", "Nu. 300"],
      ["20 tea bags × 1 g", "Nu. 300"],
      ["20 tea bags × 1 g", "Nu. 300"],
      ["20 tea bags × 2 g", "Nu. 300"],
      ["20 tea bags × 1 g", "Nu. 300"],
      ["Loose leaf, 10 g", "Nu. 200"],
    ],
  );
});

test("the client's one-line descriptions are used as written", () => {
  assert.equal(getTea("chamomile")?.shortDescription, "Soft, floral and gently aromatic. A classic caffeine-free herbal infusion.");
  assert.equal(getTea("hypericum")?.shortDescription, "A single-herb infusion made with Hypericum, also known as St. John's wort.");
});

test("Hypericum carries the client's safety note; no other tea needs one", () => {
  const caution = getTea("hypericum")?.caution ?? "";
  assert.match(caution, /interact with many medicines/);
  assert.match(caution, /pregnancy or breastfeeding/);
  for (const tea of teas.filter((t) => t.slug !== "hypericum")) assert.equal(tea.caution, undefined, tea.slug);
});

test("certified organic is claimed only where a source says so", () => {
  // Daily Bhutan (2023) covers the original five; nothing yet confirms Chrysanthemum.
  assert.deepEqual(
    teas.filter((t) => t.certifiedOrganic).map((t) => t.slug),
    ["chamomile", "mint", "lemon-verbena", "himalayan-sea-berry", "hypericum"],
  );
});

test("specialty teas and gifts from the catalogue", () => {
  assert.deepEqual(
    specialtyTeas.map((t) => t.name),
    ["Himalayan Ginseng Tea", "Cordyceps Ginseng Tea", "Inner Peace Tea", "Assorted Tea Gift Box"],
  );
  assert.ok(teasPage.specialty.heading && teasPage.priceNote);
});

test("the client's contact details", () => {
  assert.equal(contact.whatsapp, "97577863786");
  assert.equal(contact.phone, "+975 77863786");
  assert.equal(contact.email, "herbalboy27@gmail.com");
  assert.equal(contact.social.instagram, "https://www.instagram.com/bhutan_herbal_tea/");
  assert.equal(contact.address, "Bumthang, Bhutan");
});

test("WhatsApp and email links can carry a prefilled message", () => {
  assert.equal(whatsappHref("97577863786", "Mint Tea enquiry"), "https://wa.me/97577863786?text=Mint%20Tea%20enquiry");
  assert.equal(whatsappHref("", "hello"), null);
  assert.equal(
    mailtoHref("a@b.bt", { subject: "Hi there", body: "Line 1\nLine 2" }),
    "mailto:a@b.bt?subject=Hi%20there&body=Line%201%0ALine%202",
  );
});

test("contact page offers prefilled enquiries, wholesale and farm visits", () => {
  assert.deepEqual(
    contactPage.enquiries.map((e) => e.label),
    ["Buying herbal tea", "Wholesale and export", "Gift boxes", "Visiting the farm"],
  );
  for (const enquiry of contactPage.enquiries) assert.ok(enquiry.message.length > 10);
  assert.ok(contactPage.wholesale.audience.length >= 5);
  assert.ok(contactPage.wholesale.email.subject.includes("Wholesale"));
  assert.ok(contactPage.visit.message.includes("farm visit"));
});

test("How It's Grown has the five farm-to-cup steps and the certifications", () => {
  assert.deepEqual(farmSteps.map((s) => s.title), ["Growing", "Harvesting", "Drying", "Quality", "Packing"]);
  assert.deepEqual(certifications.items, [
    "LOAS",
    "BFDA Organic",
    "BFDA GHP/GMP",
    "BFDA product certification",
    "Brand Bhutan / Grown in Bhutan",
  ]);
});

test("each tea page has an order section with a prefilled WhatsApp message", () => {
  assert.equal(teaDetailCopy.order.message("Mint"), "Hello Bhutan Herbal Tea, I would like to enquire about Mint Tea.");
});
