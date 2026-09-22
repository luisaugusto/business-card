import type { NextConfig } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";

const config: NextConfig = {
  basePath: "/contact",
  poweredByHeader: false,
  // Compile availability into the release; ISR must not inspect CDN-only files.
  env: { NEXT_PUBLIC_WALLET_AVAILABLE: existsSync(join(process.cwd(), "public", "Luis-Augusto.pkpass")) ? "1" : "0" },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    }, {
      source: "/Luis-Augusto.pkpass",
      headers: [
        { key: "Content-Type", value: "application/vnd.apple.pkpass" },
        { key: "Content-Disposition", value: 'inline; filename="Luis-Augusto.pkpass"' },
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
      ],
    }];
  },
};
export default config;
