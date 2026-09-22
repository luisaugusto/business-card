// Shared dark palette. Wallet needs sRGB; the website uses the original OKLCH.
export type Oklch = readonly [number, number, number];
export const darkPalette = {
  bg: [.18, .008, 80], surface: [.225, .008, 80],
  ink: [.96, .006, 80], muted: [.70, .010, 80],
  line: [.31, .008, 80], accent: [.78, .13, 70],
  "btn-ink": [.19, .02, 70],
} as const satisfies Record<string, Oklch>;

export const brandVariables = Object.fromEntries(
  Object.entries(darkPalette).map(([key, value]) => [`--brand-${key}`, `oklch(${value.join(" ")})`]),
);

export function walletRgb([L, C, h]: Oklch): string {
  const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
  const l = (L + .3963377774 * a + .2158037573 * b) ** 3;
  const m = (L - .1055613458 * a - .0638541728 * b) ** 3;
  const s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s,
    -.0041960863 * l - .7034186147 * m + 1.707614701 * s];
  const rgb = linear.map(v => Math.round(255 * Math.max(0, Math.min(1,
    v <= .0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - .055))));
  return `rgb(${rgb.join(",")})`;
}
