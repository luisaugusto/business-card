import Image from "next/image";
import { profile } from "@/lib/profile";

export function PocketCard() {
  return (
    <section className="pocket-stage" aria-label="Luis's business card">
      <article className="paper-card">
        <header className="card-identity">
          <div className="portrait-and-name">
            <Image className="portrait" src={profile.portrait} alt={profile.name} width={80} height={80} sizes="(max-width: 360px) 64px, 80px" preload />
            <h1><span>{profile.givenName}</span><span>{profile.familyName}</span></h1>
          </div>
          <p className="role">{profile.title}</p>
        </header>
      </article>

      <Image className="paper-sleeve" src="/contact/textures/sleeve-front.webp" alt="" width={1464} height={838} sizes="(max-width: 480px) 85vw, 400px" preload />

    </section>
  );
}
