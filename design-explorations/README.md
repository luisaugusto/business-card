# Business card design exploration

Five visual concepts for review, using Luis's current website and supplied portrait. Created with built-in Image Gen. These are static design mockups; interactions described below are proposed, not implemented. The application source has not been changed.

The numbering follows the order the generated images were displayed in the conversation.

| Option | Preview | Proposed interaction |
| --- | --- | --- |
| 1 | [Pressed in Paper](01-pressed-in-paper.png) | Gentle pointer tilt, lift, and flip; tactile ivory stock and an amber edge. |
| 2 | [Prismatic](02-prismatic.png) | Pointer-driven foil lighting and drag to rotate a dark metallic card. |
| 3 | [The Sleeve](03-the-sleeve.png) | Pull or tap to slide the cream contact card out of its red sleeve. |
| 4 | [Swiss Fold](04-swiss-fold.png) | Unfold three connected panels to reveal identity and contact links. |
| 5 | [Pocket Deck](05-pocket-deck.png) | Fan and swipe separate contact, writing, and social cards with spring motion. |

Implementation should keep Save my contact and contact links accessible without a hidden gesture. Provide tap/click and keyboard equivalents to dragging, responsive mobile layouts, and reduced-motion behavior. Preserve existing vCard and eligible Apple Wallet behavior. Use actual writing feed content only when available.

Generation prompts and source references are recorded in [prompts.json](prompts.json). The current-site capture is in [references/current-site.png](references/current-site.png).
