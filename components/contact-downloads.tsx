"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DownloadIcon } from "@/components/icons";
import { supportsWalletDownload } from "@/lib/wallet-device";

export function ContactDownloads({ walletAvailable }: { walletAvailable: boolean }) {
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => { setIsIOS(supportsWalletDownload(navigator.userAgent)); }, []);

  return <div className="contact-downloads">
    <a className="save-contact" href="/contact/Luis-Augusto.vcf" download="Luis-Augusto.vcf">
      <DownloadIcon /><span>Save my contact</span>
    </a>
    {walletAvailable && isIOS && <a className="add-wallet" href="/contact/Luis-Augusto.pkpass" aria-label="Add to Apple Wallet">
      <Image src="/contact/add-to-apple-wallet.svg" alt="Add to Apple Wallet" width={146} height={46} unoptimized />
    </a>}
  </div>;
}
