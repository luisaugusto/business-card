import { Suspense } from "react";
import Image from "next/image";
import { EmailIcon, ExternalIcon } from "@/components/icons";
import { ContactDownloads } from "@/components/contact-downloads";
import { PocketCard } from "@/components/pocket-card";
import { Writing } from "@/components/writing";
import { profile } from "@/lib/profile";

export const revalidate = 3600;

export default function ContactPage() {
  return (
    <main className="contact-page" id="main">
      <header className="page-header">
        <Image className="monogram" src="/contact/textures/la-embossed.png" alt="LA" width={42} height={42} sizes="42px" />
        <p>{profile.city}, {profile.region}</p>
      </header>

      <PocketCard />

      <section className="contact-actions" aria-label="Save or contact Luis">
        <ContactDownloads walletAvailable={process.env.NEXT_PUBLIC_WALLET_AVAILABLE === "1"} />
        <a className="email-link" href={`mailto:${profile.email}`}>
          <EmailIcon /><span>{profile.email}</span><ExternalIcon />
        </a>
        <nav className="social-links" aria-label="Find Luis online">
          <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub<ExternalIcon /></a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<ExternalIcon /></a>
          <a href={profile.publication} target="_blank" rel="noopener noreferrer">Writing<ExternalIcon /></a>
        </nav>
      </section>

      <Suspense fallback={null}><Writing /></Suspense>
    </main>
  );
}
