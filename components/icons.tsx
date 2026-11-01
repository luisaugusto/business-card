import { ArrowUpIcon } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";

export function LiftIcon() { return <ArrowUpIcon size={24} aria-hidden="true" />; }
export function ReturnIcon() { return <ArrowDownIcon size={24} aria-hidden="true" />; }
export function ExternalIcon() { return <ArrowUpRightIcon size={23} aria-hidden="true" />; }
export function DownloadIcon() { return <DownloadSimpleIcon size={22} aria-hidden="true" />; }
export function EmailIcon() { return <EnvelopeSimpleIcon size={23} aria-hidden="true" />; }
