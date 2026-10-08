import { test } from "node:test";
import assert from "node:assert/strict";
import { hasDirectContact, mailtoHref, socialLinks, telHref, whatsappHref } from "../src/lib/contact.ts";
import type { Contact } from "../src/data/site.ts";

const empty: Contact = {
  phone: "",
  whatsapp: "",
  email: "",
  social: { facebook: "", instagram: "" },
  whereToBuy: [],
};

test("whatsappHref keeps digits only and rejects empty or too-short numbers", () => {
  assert.equal(whatsappHref(""), null);
  assert.equal(whatsappHref("123"), null);
  assert.equal(whatsappHref("+975 17 12 34 56"), "https://wa.me/97517123456");
});

test("telHref keeps a leading plus and rejects empty numbers", () => {
  assert.equal(telHref(""), null);
  assert.equal(telHref("+975 2 33 44 55"), "tel:+9752334455");
});

test("mailtoHref rejects empty or malformed addresses", () => {
  assert.equal(mailtoHref(""), null);
  assert.equal(mailtoHref("not-an-email"), null);
  assert.equal(mailtoHref(" hello@example.bt "), "mailto:hello@example.bt");
});

test("hasDirectContact is false when every direct channel is empty", () => {
  assert.equal(hasDirectContact(empty), false);
  assert.equal(hasDirectContact({ ...empty, email: "hello@example.bt" }), true);
});

test("socialLinks drops empty and non-https links", () => {
  assert.deepEqual(socialLinks(empty), []);
  const links = socialLinks({
    ...empty,
    social: { facebook: "https://www.facebook.com/herbaltea.bhutan/", instagram: "javascript:alert(1)" },
  });
  assert.deepEqual(links, [
    { network: "facebook", label: "Facebook", href: "https://www.facebook.com/herbaltea.bhutan/" },
  ]);
});
