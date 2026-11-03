import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import nextConfig from "../next.config";
import { profile } from "../lib/profile";

test("Vercel serves the root while retaining the contact asset and API namespace", () => {
  const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.deepEqual(config.rewrites, [{ source: "/", destination: "/contact" }]);
  assert.deepEqual(config.headers, [{ source: "/", headers: [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  ] }]);
  assert.equal(nextConfig.basePath, "/contact");
  assert.equal(new URL(profile.portrait, profile.canonical).href, "https://contact.luis.app/contact/portrait.jpg");
  assert.equal(profile.website, "https://luis.app");
});
