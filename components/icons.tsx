import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
export function DownloadIcon() { return <Icon><path d="M12 3v12M7 11l5 5 5-5M4 20h16" /></Icon>; }
export function GithubIcon() { return <Icon><path d="m9 18-5-6 5-6m6 0 5 6-5 6" /></Icon>; }
export function LinkedinIcon() { return <Icon><circle cx="9" cy="8" r="3" /><path d="M4 19c0-2.6 2.2-4.5 5-4.5s5 1.9 5 4.5M16 19v-6m0 2.5c0-1.4 1.1-2.5 2.5-2.5S21 14.1 21 15.5V19" /></Icon>; }
export function EmailIcon() { return <Icon><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7.5 8.5 6 8.5-6" /></Icon>; }
