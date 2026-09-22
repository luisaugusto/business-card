import { XMLParser, XMLValidator } from "fast-xml-parser";
import { convert } from "html-to-text";
import { profile } from "./profile";

export type Post = { title: string; date: string; excerpt: string; url: string };
export type Writing = { posts: Post[]; checkedAt: string };

function text(value: unknown): string {
  if (typeof value !== "string") return "";
  return convert(value, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  }).replace(/\s+/g, " ").trim();
}

export function parseFeed(xml: string, now = Date.now()): Post[] {
  if (xml.length > 2_000_000 || /<!DOCTYPE|<!ENTITY/i.test(xml)) {
    throw new Error("Unsupported feed document");
  }
  if (XMLValidator.validate(xml) !== true) throw new Error("Malformed RSS feed");
  const data = new XMLParser({ ignoreAttributes: true, parseTagValue: false }).parse(xml);
  if (!data?.rss?.channel || typeof data.rss.channel !== "object") {
    throw new Error("Missing RSS channel");
  }
  const items = data.rss.channel.item ?? [];
  const candidates: unknown[] = Array.isArray(items) ? items : [items];
  const unique = new Map<string, Post>();
  for (const raw of candidates) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;
    const title = text(item.title);
    const published = Date.parse(String(item.pubDate ?? ""));
    if (!title || !Number.isFinite(published) || published > now) continue;
    let url: URL;
    try { url = new URL(String(item.link ?? "")); } catch { continue; }
    if (url.origin !== profile.publication || !url.pathname.startsWith("/p/")) continue;
    url.hash = "";
    url.search = "";
    const description = text(item.description || item["content:encoded"]);
    const excerpt = description.length > 180
      ? description.slice(0, 177).replace(/\s+\S*$/, "") + "…"
      : description;
    unique.set(url.href, { title, date: new Date(published).toISOString(), excerpt, url: url.href });
  }
  return [...unique.values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 3);
}

export async function fetchWriting(fetcher: typeof fetch = fetch): Promise<Writing> {
  const response = await fetcher(profile.feed, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml", "User-Agent": "LuisContact/1.0 (+https://luis.app/contact)" },
    signal: AbortSignal.timeout(8_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Substack feed returned HTTP ${response.status}`);
  const xml = await response.text();
  return { posts: parseFeed(xml), checkedAt: new Date().toISOString() };
}
