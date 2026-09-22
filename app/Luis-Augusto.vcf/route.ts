import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createVcard } from "@/lib/vcard";

export const dynamic = "force-static";

export async function GET() {
  const photo = await readFile(join(process.cwd(), "public", "portrait.jpg"));
  return new Response(createVcard(photo), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Luis-Augusto.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
