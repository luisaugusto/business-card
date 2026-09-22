import assert from "node:assert/strict";
import test from "node:test";
import { fetchWriting, parseFeed } from "../lib/feed";
const rss = (items = "") => `<?xml version="1.0"?><rss version="2.0"><channel><title>Luis Augusto</title>${items}</channel></rss>`;
const item = (slug: string, date: string, title = "An actual article", description = "A short description") => `<item><title><![CDATA[${title}]]></title><link>https://luisaugusto.substack.com/p/${slug}</link><pubDate>${date}</pubDate><description><![CDATA[${description}]]></description></item>`;

test("empty publication has no invented posts", () => assert.deepEqual(parseFeed(rss()), []));
test("returns three newest unique articles with real dates and plain text", () => {
  const result = parseFeed(rss(
    item("one", "2026-01-01") + item("two", "2026-02-01") + item("three", "2026-03-01") + item("four", "2026-04-01", "Tools &amp; learning", "<p>Read <a href='https://example.com'>this</a>.</p><script>evil()</script>") + item("four", "2026-04-01", "Tools &amp; learning", "<p>Read <a href='https://example.com'>this</a>.</p><script>evil()</script>")
  ));
  assert.deepEqual(result.map(p => p.url.split("/").pop()), ["four", "three", "two"]);
  assert.equal(result[0].title, "Tools & learning");
  assert.equal(result[0].excerpt, "Read this.");
  assert.equal(result[0].date, "2026-04-01T00:00:00.000Z");
});
test("skips future, undated, unsafe, and unrelated URLs", () => {
  const invalid = item("future", "2099-01-01") + item("invalid", "no date") + item("bad", "2026-01-01").replace("https://luisaugusto.substack.com/p/bad", "javascript:alert(1)") + item("other", "2026-01-01").replace("luisaugusto.substack.com", "other.substack.com");
  assert.deepEqual(parseFeed(rss(invalid)), []);
});
test("HTML block pages, broken XML, and entities are errors, not an empty feed", () => {
  for (const xml of ["<html>Access denied</html>", "<rss><channel>", '<!DOCTYPE rss [<!ENTITY x "bad">]><rss/>']) assert.throws(() => parseFeed(xml));
});
test("fetch errors propagate so cached posts survive failed refreshes", async () => {
  const blocked = (async () => new Response("Forbidden", { status: 403 })) as typeof fetch;
  await assert.rejects(fetchWriting(blocked), /HTTP 403/);
  const unavailable = (async () => { throw new Error("offline"); }) as typeof fetch;
  await assert.rejects(fetchWriting(unavailable), /offline/);
});
test("successful empty feed is distinguishable from a failed feed", async () => {
  const empty = (async () => new Response(rss())) as typeof fetch;
  const data = await fetchWriting(empty);
  assert.deepEqual(data.posts, []);
  assert.ok(Number.isFinite(Date.parse(data.checkedAt)));
});
