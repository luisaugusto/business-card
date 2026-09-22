// Wallet passes are supported on iPhone/iPod; Apple Pay capability is unrelated.
export function supportsWalletDownload(userAgent: string): boolean {
  return /\b(iPhone|iPod)\b/i.test(userAgent) && !/\biPad\b/i.test(userAgent);
}
