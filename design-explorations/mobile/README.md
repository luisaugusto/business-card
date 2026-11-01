# Mobile design exploration

Three static mobile-first visual concepts adapting the user's favorites from the desktop round. The user prefers textures, soft colors, and skeuomorphism. Generated with built-in Image Gen for the approximate aspect ratio of a 390 x 844 CSS-pixel content viewport. These images are not working websites or proof of responsive behavior.

| Mobile option | Original option | Preview | Touch interaction |
| --- | --- | --- | --- |
| 1 | 1: Pressed in Paper | [Pocket Letterpress](01-pocket-letterpress.png) | Upright cotton-stock card; tap Turn card to flip. |
| 2 | 3: The Sleeve | [Rose Pocket](02-rose-pocket.png) | Dusty rose vertical pocket; tap Lift card, with optional upward drag. |
| 3 | 5: Pocket Deck | [Palm Deck](03-palm-deck.png) | Compact cream, pink, and yellow stack; swipe or use labeled controls. |

## Mobile implementation priorities

- Compose for narrow screens first, then expand on desktop. Keep card edges inside the viewport.
- Keep the user's name, role, contact email and save action available without the playful gesture.
- Use real selectable text over delicate paper textures; use the real portrait and official existing Wallet badge assets.
- Provide 44px or larger touch targets and visible tap/keyboard alternatives to every drag/swipe gesture.
- Keep normal vertical scrolling; do not hijack page scroll for the sleeve interaction.
- Use natural page scrolling on short screens. Prioritize the main save action when sizing the hero; do not shrink type to fit every control above the fold.
- Respect reduced motion and avoid sensor/device-orientation requirements.
- Preserve the actual vCard and iPhone-eligible Apple Wallet downloads.
- Use Writing as a link to the real publication; show article content only when the actual feed provides posts.
- Validate a selected implementation on small phones, common phone widths, landscape, larger text, and touch before claiming it works.

The deck is the suggested starting point for touch exploration, with the letterpress concept's restrained textures. Generation prompts are recorded in [prompts.json](prompts.json).
