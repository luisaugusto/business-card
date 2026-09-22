import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createVcard, foldLine } from "../lib/vcard";
import { profile } from "../lib/profile";

test("vCard contains the confirmed details and a lossless embedded photo", () => {
  const photo = readFileSync(new URL("../public/portrait.jpg", import.meta.url));
  const vcard = createVcard(photo);
  const unfolded = vcard.replace(/\r\n /g, "");
  assert.ok(unfolded.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n"));
  assert.ok(unfolded.endsWith("END:VCARD\r\n"));
  for (const expected of [profile.name, profile.email, profile.phone, profile.github, profile.linkedin, profile.title]) assert.ok(unfolded.includes(expected));
  const base64 = unfolded.match(/PHOTO;ENCODING=b;TYPE=JPEG:(.*)\r\n/)?.[1];
  assert.ok(base64);
  assert.deepEqual(Buffer.from(base64, "base64"), photo);
  for (const line of vcard.split("\r\n")) assert.ok(Buffer.byteLength(line) <= 75);
});
test("line folding preserves multibyte characters", () => {
  const text = "FN:" + "é你好".repeat(50);
  const folded = foldLine(text);
  assert.equal(folded.replace(/\r\n /g, ""), text);
  assert.ok(folded.split("\r\n").every(line => Buffer.byteLength(line) <= 75));
});
