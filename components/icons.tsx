import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogoIcon } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";

export function ExternalIcon() { return <ArrowUpRightIcon size={23} aria-hidden="true" />; }
export function DownloadIcon() { return <DownloadSimpleIcon size={22} aria-hidden="true" />; }
export function EmailIcon() { return <EnvelopeSimpleIcon size={23} aria-hidden="true" />; }

export function GithubIcon() { return <GithubLogoIcon size={26} weight="fill" aria-hidden="true" />; }
export function LinkedinIcon() { return <LinkedinLogoIcon size={26} weight="fill" aria-hidden="true" />; }
export function SubstackIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 1h18v2H3zm0 5h18v2H3zm0 5h18v12l-9-5.5L3 23z" /></svg>;
}
