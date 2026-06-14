# Open Mercato JP Mobile Unified Landing Page Contract

## Goal

Create a new Japanese landing page from scratch based on `2026-06-14-liff-fulfillment-paypay-yamato-glass.md` and the supplied screen images:

- `liff-order-blue-light.png`
- `fulfillment-shipping-blue-dark.png`

The page must explain the unified Japan smartphone MVP: buyer-side LINE LIFF ordering, backend PayPay payment sessions, recipient-side fulfillment/picking, Yamato shipment creation, and Open Mercato Backend synchronization.

## Acceptance Criteria

1. `index.html` is rebuilt as a single integrated landing page, not a collection of three separate app listing pages.
2. The first viewport clearly shows the system value proposition and both reference screen images.
3. The page contains system overview, operation flow, app/module specification, validation evidence, production requirements, and CTA sections.
4. The visual language follows the blue glass direction: light LIFF ordering and dark fulfillment operations.
5. The page uses the supplied screen images as real product evidence and does not use placeholder boxes.
6. The copy avoids unsupported official certification, official partnership, or guaranteed complete automation claims.
7. The page is responsive and opens locally without a build step.
8. CTAs resolve to local anchors or safe mail links; no broken in-page anchors.
9. Motion is subtle, non-blocking, and respects `prefers-reduced-motion`.
10. The app specification section includes interactive local UI state, such as selectable module tabs.

## Verification

- Open each HTML file through local static serving or directly in a browser.
- Confirm page titles, H1 text, app-specific sections, CTA links, and responsive layout.
- Confirm no official logos or certification claims are embedded.
- Confirm deployment status or, if blocked by provider authentication, record the blocker and the next action.
- Confirm the SNS WBS is actionable enough for immediate execution.
