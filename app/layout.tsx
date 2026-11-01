import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { profile } from "@/lib/profile";
import "./globals.css";

const sans = localFont({ src: "../node_modules/@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2", variable: "--font-sans", display: "swap" });
const serif = localFont({ src: "../node_modules/@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2", variable: "--font-serif", display: "swap" });
const mono = localFont({ src: [
  { path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
  { path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
], variable: "--font-mono", display: "swap" });

const description = `Connect with ${profile.name} — ${profile.title} in ${profile.city}, ${profile.region}. Save my contact or find me on GitHub and LinkedIn.`;
export const metadata: Metadata = {
  metadataBase: new URL(profile.website),
  title: `${profile.name} — ${profile.title}`,
  description,
  alternates: { canonical: profile.canonical },
  icons: { icon: "/contact/favicon.svg" },
  openGraph: { type: "profile", title: profile.name, description, url: profile.canonical, firstName: profile.givenName, lastName: profile.familyName, images: [{ url: profile.portrait, alt: profile.name }] },
  twitter: { card: "summary", title: profile.name, description, images: [profile.portrait] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light", themeColor: "#efc7bc" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}><body>{children}</body></html>;
}
