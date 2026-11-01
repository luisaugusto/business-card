"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ExternalIcon, LiftIcon, ReturnIcon } from "@/components/icons";
import { profile } from "@/lib/profile";

const links = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Writing on Substack", href: profile.publication },
];

export function PocketCard() {
  const [open, setOpen] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  function toggleCard() {
    setHasMoved(true);
    setOpen(value => !value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    }
  }

  return (
    <section className="pocket-stage" data-open={open} data-moved={hasMoved} aria-label="Luis's business card" onKeyDown={handleKeyDown}>
      <button ref={toggleRef} className="card-toggle" type="button" aria-expanded={open} aria-controls="card-links" onClick={toggleCard}>
        {open ? <ReturnIcon /> : <LiftIcon />}
        <span>{open ? "Put back" : "Lift card"}</span>
      </button>
      <article className="paper-card">
        <header className="card-identity">
          <div className="portrait-and-name">
            <Image className="portrait" src={profile.portrait} alt={profile.name} width={80} height={80} sizes="(max-width: 360px) 64px, 80px" preload />
            <h1><span>{profile.givenName}</span><span>{profile.familyName}</span></h1>
          </div>
          <p className="role">{profile.title}</p>
        </header>
        <nav id="card-links" className="card-links" aria-label="Links inside the card" aria-hidden={!open} inert={!open}>
          {links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"><span>{link.label}</span><ExternalIcon /></a>)}
        </nav>
      </article>

      <Image className="paper-sleeve" src="/contact/textures/sleeve-front.webp" alt="" width={1464} height={838} sizes="(max-width: 480px) 85vw, 400px" preload />

      <span className="sr-only" role="status">{open ? "Card lifted. Three profile links are available." : ""}</span>
    </section>
  );
}
