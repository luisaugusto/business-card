# Rose Pocket implementation QA

Date: September 27, 2026

final result: passed

Local implementation: http://localhost:3100/contact

## Visual truth and evidence

- Closed source: `design-explorations/mobile/header-monogram-rose-pocket/rose-pocket-closed.png`.
- Lifted source: `design-explorations/mobile/header-monogram-rose-pocket/rose-pocket-lifted.png`.
- Both source images are 935 × 1683 pixels. They were normalized to the 390 × 702 CSS-pixel viewport for comparison.
- Browser captures use device pixel ratio 1 and contain only the webpage, without a phone frame or browser chrome.
- Final production-build captures: `artifacts/design-qa/mobile-390-closed.png` and `artifacts/design-qa/mobile-390-open.png`.
- Combined source-left / implementation-right comparisons: `artifacts/design-qa/comparison-closed.png` and `artifacts/design-qa/comparison-open.png` (796 × 702 pixels).
- Focused header comparison: `artifacts/design-qa/comparison-header.png` (both sources enlarged equally to inspect the embossed monogram, portrait, two-line name, and subtitle).
- Additional browser captures: `artifacts/design-qa/mobile-320-closed.png`, `mobile-320-open.png`, `mobile-430-closed.png`, and `desktop-1280-closed.png` in the same directory. The 360-pixel breakpoint was also inspected in the browser.

Evidence images are local and ignored by Git. The closed reference governs shared geometry: the two generated mockups differ in portrait and card height, so the implementation deliberately keeps the header and action rows stationary across the interaction.

The browser has a desktop user agent, including at phone viewport widths. Its screenshots correctly show a full-width Save contact button. The reference shows an eligible iPhone's two-button row. This expected device difference is excluded from visual mismatch judgments; eligibility tests and the signed Wallet response were verified separately.

## Findings and iteration history

No actionable P0, P1, or P2 findings remain in the inspected states.

1. Initial browser inspection found oversized background grain, smaller footer text, and a wider sleeve than the closed reference. The background texture was reduced in opacity, small link labels enlarged, and the sleeve inset and proportions adjusted. The final combined closed comparison shows a softer surface and aligned contact rows.
2. Keyboard inspection identified that opening the card would tab directly to Save contact because the reveal button followed the hidden links in document order. The button now precedes the revealed content. Enter opens the card, Tab enters GitHub, Escape returns focus to Lift card, and Tab skips the hidden links when closed.
3. Final production-build captures were compared in closed and lifted states. Identity and action geometry remain stable, all intended copy is readable, and the links are revealed cleanly above the sleeve. Browser console inspection returned no warnings or errors.

## Required fidelity surfaces

- **Typography:** Self-hosted DM Serif Display provides the two-line serif name; IBM Plex Mono handles the subtitle and utility text; Public Sans handles Save contact. The name and photo share a compact row, and the role stays beneath it. Slightly larger link labels and generous hit areas are intentional readability adjustments.
- **Spacing and layout:** A single mobile-first column expands to a maximum of 400 pixels on desktop. The email occupies its own full-width row. Footer links use equal columns. Contact actions had exactly the same measured position and dimensions in open and closed states at 390 pixels. No horizontal page overflow was observed at 320, 360, 390, 430, or 1280 pixels.
- **Colors and tokens:** Blush page, dusty rose sleeve, ivory paper, and dark plum typography preserve the approved palette. Generated material textures are variations of the reference, not exact pixel copies. The stable light palette replaces the previous theme toggle.
- **Image quality:** The actual supplied portrait is retained; the mockup's regenerated face is not substituted. The monogram and sleeve use generated raster assets with real alpha transparency. Seams, notch, and paper texture remain visible without conspicuous halos. The portrait's softness reflects the supplied photo. The embossed logo appears only in the page header.
- **Copy and content:** Confirmed profile details and actual destinations remain in `lib/profile.ts`. The sleeve reads “hello.” and “A card from Luis”; live controls say “Lift card”, “Put back”, and “Save contact”. There are no placeholder articles. The actual empty writing feed remains hidden.

## Functional verification

- Click and Enter open the card; click and Escape close it.
- Revealed links enter the keyboard tab order; closed links are inert and hidden from accessibility exposure.
- Escape returns focus to the stable toggle control.
- Save contact triggered a browser download. HTTP verification confirmed the expected vCard identity, email, and embedded JPEG photo.
- The Wallet endpoint returned HTTP 200 with `application/vnd.apple.pkpass`, the expected filename, and a pass archive. The build verified its certificate chain, signature, and manifest.
- The existing 12 tests, TypeScript check, and production build all pass through `npm run check`.
- The production build was served locally and its final closed/open states and console checked in the browser.
- Reduced-motion CSS removes animation and transitions while retaining the open-state stacking order. This was inspected in code; OS-level reduced-motion emulation was unavailable in the selected browser.

## Remaining review scope

- Physical iPhone/Safari touch behavior and adding the pass to Wallet remain for device testing. No physical-device or Wallet-installation claim is made.
- Minor P3 differences remain in the exact paper grain, monogram highlights, and diffuse shadow shape versus the generated mockup. These preserve the chosen art direction and do not affect use.
- No remote push or deployment was performed. The local production preview is available on port 3100 for review.

## Implementation checklist

- [x] Mobile-first paper sleeve and lift interaction
- [x] Header-only embossed LA and compact photo/name layout
- [x] Stable, aligned contact actions and separate email row
- [x] Keyboard controls and reduced-motion styling
- [x] Existing vCard, Wallet eligibility, and real writing behavior preserved
- [x] Local visual comparisons and build verification
- [ ] User review before any push
