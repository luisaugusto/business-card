import { profile } from "./profile";

function escapeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

// RFC 2425: fold long content lines at 75 octets, without splitting UTF-8 characters.
export function foldLine(line: string): string {
  const lines: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = Buffer.byteLength(char);
    if (bytes + size > 75) { lines.push(current); current = " "; bytes = 1; }
    current += char;
    bytes += size;
  }
  lines.push(current);
  return lines.join("\r\n");
}

export function createVcard(photo: Buffer): string {
  return [
    "BEGIN:VCARD", "VERSION:3.0",
    `N:${escapeValue(profile.familyName)};${escapeValue(profile.givenName)};;;`,
    `FN:${escapeValue(profile.name)}`,
    `TITLE:${escapeValue(profile.title)}`,
    `EMAIL;TYPE=INTERNET,PREF:${profile.email}`,
    `TEL;TYPE=CELL:${profile.phone}`,
    `ADR;TYPE=HOME:;;;${profile.city};${profile.region};;${profile.country}`,
    `URL:${profile.website}`,
    `X-SOCIALPROFILE;TYPE=github:${profile.github}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}`,
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo.toString("base64")}`,
    "END:VCARD",
  ].map(foldLine).join("\r\n") + "\r\n";
}
