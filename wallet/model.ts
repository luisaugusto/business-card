import { profile } from "../lib/profile";
import { darkPalette, walletRgb } from "../lib/brand";

// Preserve these identifiers so re-adding a pass updates the existing card.
export const walletIdentity = {
  passTypeIdentifier: "pass.app.luis.contact",
  teamIdentifier: "A2C6C68DY8",
  serialNumber: "luis-contact-001",
} as const;

type ContactProfile = Pick<typeof profile, "name" | "title" | "email" | "city" | "region" | "canonical">;
type PublicProfile = { [K in keyof ContactProfile]: string };
const html = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function createPass(contact: PublicProfile = profile) {
  const url = new URL(contact.canonical);
  if (url.protocol !== "https:") throw new Error("Wallet QR destination must use HTTPS.");
  return {
    formatVersion: 1,
    ...walletIdentity,
    organizationName: contact.name,
    description: `Contact card for ${contact.name}, ${contact.title}`,
    logoText: contact.name,
    backgroundColor: walletRgb(darkPalette.bg),
    foregroundColor: walletRgb(darkPalette.ink),
    labelColor: walletRgb(darkPalette.accent),
    barcodes: [{ format: "PKBarcodeFormatQR", message: contact.canonical, messageEncoding: "utf-8", altText: `${url.host}${url.pathname}` }],
    generic: {
      primaryFields: [{ key: "name", label: "", value: contact.name }],
      secondaryFields: [{ key: "role", label: "ROLE", value: contact.title }],
      auxiliaryFields: [{ key: "email", label: "EMAIL", value: contact.email }],
      backFields: [
        { key: "website", label: "WEBSITE", value: contact.canonical },
        { key: "contact-email", label: "EMAIL", value: contact.email, attributedValue: `<a href="mailto:${html(contact.email)}">${html(contact.email)}</a>` },
        { key: "about", label: "ABOUT", value: `${contact.name}\n${contact.title}\n${contact.city}, ${contact.region}` },
      ],
    },
  };
}
