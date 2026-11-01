# Revealed mobile card states

Static visual previews of the two mobile concepts under consideration. These are Image Gen mockups, not animation or responsive implementation tests. Original mobile numbering is retained.

## 1: Pocket Letterpress — turned over

[Front](../01-pocket-letterpress.png) → [Back](01-pocket-letterpress-back.png)

The card turns 180 degrees around its vertical center axis, revealing a printed contact side with email, GitHub, LinkedIn and a link to the real Substack publication. The control becomes Show front. Proposed duration: approximately 550 milliseconds with gentle easing; settle without a large bounce. The outer save and Wallet controls should remain stationary in the implementation.

## 2: Rose Pocket — lifted out

[In sleeve](../02-rose-pocket.png) → [Lifted](02-rose-pocket-lifted.png)

The card moves up and forward, clears the sleeve's front layer, and settles in front of the sleeve. Its lower section reveals GitHub, LinkedIn and Writing on Substack. The portrait and identity remain visible. The control becomes Put back. Proposed duration: approximately 700 milliseconds with a soft settle. This requires layered depth and correct occlusion, not merely translating the card upward out of the viewport. Preserve the card's dimensions and the surrounding controls during implementation; the generated images illustrate the intended appearance, not exact geometry.

## Shared behavior

Both interactions reverse on a second tap. Links are independently tappable without triggering the card. Essential contact actions remain available in either state. Provide keyboard controls, focus management, and an immediate or brief crossfade alternative under reduced motion. The same real vCard, official Wallet badge and public profile URLs remain in use. No invented writing articles are shown.

[Generation prompts](prompts.json)
