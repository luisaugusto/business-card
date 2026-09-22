import { Suspense } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { GithubIcon, LinkedinIcon, EmailIcon } from "@/components/icons";
import { ContactDownloads } from "@/components/contact-downloads";
import { Writing } from "@/components/writing";
import { profile } from "@/lib/profile";

export const revalidate = 3600;

export default function ContactPage() {
  return (
    <main className="card" id="main">
      <div className="topbar rise"><span>{profile.city}, {profile.region}</span><ThemeToggle /></div>
      <header className="profile rise">
        <div className="portrait-wrap">
          <div className="glow" aria-hidden="true" />
          <Image className="portrait" src={profile.portrait} alt={profile.name} width={104} height={104} sizes="104px" preload />
        </div>
        <div className="identity"><h1>{profile.name}</h1><p>{profile.title}</p></div>
      </header>
      <div className="actions">
        <ContactDownloads walletAvailable={process.env.NEXT_PUBLIC_WALLET_AVAILABLE === "1"} />
        <nav className="socials" aria-label="Contact and social profiles">
          <a href={profile.github} target="_blank" rel="noopener noreferrer"><GithubIcon /><span>GitHub</span></a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinIcon /><span>LinkedIn</span></a>
          <a href={`mailto:${profile.email}`}><EmailIcon /><span>Email</span></a>
        </nav>
      </div>
      <Suspense fallback={null}><Writing /></Suspense>
    </main>
  );
}
