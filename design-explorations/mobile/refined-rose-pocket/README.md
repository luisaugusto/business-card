# Refined Rose Pocket

The user selected mobile option 2, Rose Pocket, and requested the interlocking LA mark and richer card texture from mobile option 1. This pair shows the resulting design in both interaction states. Created with built-in Image Gen; these are static visual targets, not implemented or tested website behavior.

- [Card in sleeve](rose-pocket-closed.png)
- [Card lifted](rose-pocket-lifted.png)

## Requested refinements

- Transfer the serif LA monogram where the horizontal foot of the L intersects the A at its middle. Use the same mark as the top-left page logo and a blind embossed relief at the card's upper right.
- Transfer the rich ivory cotton-stock paper texture from Pocket Letterpress, with fine irregular fibers and subtle relief.
- Retain the soft blush canvas, dusty rose sleeve, portrait, identity and tactile lift interaction of Rose Pocket.
- Place Save contact and the existing official Apple Wallet badge side by side, aligned to the same width and height where space permits. On narrower widths or enlarged text, wrap deliberately and retain a consistent content column without shrinking readable type or distorting the Wallet artwork.
- Place email in its own full-width row under the downloads. Remove the isolated email between two centered buttons.
- Align GitHub, LinkedIn and Writing in one consistent lower row.
- Integrate Lift card into the sleeve; show Put back on the exposed card when lifted. Keep each text control's real touch target at least 44px.
- Keep download and contact controls in fixed layout positions during the card motion.

## Implementation boundaries

Use the actual portrait and official Wallet badge assets rather than generated equivalents. Build the monogram as a faithful reusable asset, with the same letter intersection in the page and embossed treatment. Keep identity and links as selectable text over a separate paper texture. Preserve real vCard and supported iPhone Wallet behavior. Verify mobile layout, touch, keyboard, reduced motion and larger text in the actual implementation. This design does not claim completed accessibility or responsive testing.

The generated images share the same actual dimensions, 935 x 1683. The initial prompt requested a taller reference ratio; the tool returned this more compact phone composition, approximately 390 x 702 at CSS scale. Treat it as a visual target, not a fixed page-height specification.

[Generation prompts](prompts.json)
