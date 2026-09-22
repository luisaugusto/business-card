import { getWriting } from "@/lib/writing";

export async function GET() {
  try {
    return Response.json(await getWriting(), {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return Response.json({ posts: [], status: "unavailable" }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}
