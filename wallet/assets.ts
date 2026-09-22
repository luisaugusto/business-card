import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { createPass } from "./model";

export async function writeTemplate(template: string, portrait: Buffer, pass = createPass()) {
  await mkdir(template, { recursive: true });
  await writeFile(join(template, "pass.json"), JSON.stringify(pass, null, 2) + "\n");
  await writeFile(join(template, "tooling.json"), JSON.stringify({ automaticallyGenerateCompatiblePass: false, designerVersion: "1.0" }, null, 2) + "\n");
  for (const scale of [1, 2, 3]) {
    const suffix = scale === 1 ? "" : `@${scale}x`;
    for (const [name, size] of [["thumbnail", 90], ["logo", 38]] as const) {
      const n = size * scale;
      const mask = Buffer.from(`<svg width="${n}" height="${n}"><circle cx="${n / 2}" cy="${n / 2}" r="${n / 2}" fill="white"/></svg>`);
      await sharp(portrait).resize(n, n, { fit: "cover" }).composite([{ input: mask, blend: "dest-in" }]).png().toFile(join(template, `${name}${suffix}.png`));
    }
    const icon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${38 * scale}" height="${38 * scale}" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${pass.backgroundColor}"/><path d="M20 17v30h25v-6H27V17z" fill="${pass.labelColor}"/></svg>`);
    await sharp(icon).png().toFile(join(template, `icon${suffix}.png`));
  }
}
