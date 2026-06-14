# Run: LIFF Order / Fulfillment Shipping / PayPay / Yamato Glass UI

Date: 2026-06-14

## Objective

Apply the updated Japan smartphone MVP direction by separating the apps into independent folders, applying the transparent `design.md` theme, moving PayPay into Backend payment infrastructure, and adding the recipient-side picking and Yamato shipping workflow.

## Scope

- `apps/jp-liff-order`: LINE LIFF order app on port 3201.
- `apps/jp-fulfillment-shipping`: recipient-side picking, Yamato label printing, and shipment status sync app on port 3202.
- `packages/gateway-paypay`: Backend Payment Gateway provider for PayPay OPA Dynamic QR.
- `packages/carrier-yamato`: Backend Shipping Carrier provider for Yamato label/tracking records.
- `apps/mercato/src/modules.ts`: enabled `gateway_paypay` and `carrier_yamato`.
- `design.md`: transparent `Frosted Fulfillment` theme.

## Implementation Notes

- Replaced the previous three-app mobile split with two independent apps: ordering and fulfillment.
- PayPay credentials, HMAC signing, merchant configuration, and Dynamic QR session creation are confined to Backend provider code.
- The LIFF app dynamically loads the LINE LIFF SDK when `NEXT_PUBLIC_LINE_LIFF_ID` is set; otherwise it remains in preview mode.
- The LIFF app calls local `POST /api/paypay-session`, which forwards to `POST /api/payment_gateways/sessions` when `OPEN_MERCATO_BACKEND_TOKEN` exists.
- The fulfillment app blocks shipment creation and printing until all order items are picked.
- The fulfillment app calls local `POST /api/ship-order`, which forwards to `POST /api/shipping_carriers/shipments` and then attempts `PUT /api/sales/orders` with shipment metadata and optional `OPEN_MERCATO_SHIPPED_STATUS_ENTRY_ID`.
- Added `lineItems` to the shared payment gateway session API so redirect-based PayPay sessions can carry order details.
- Added SVG favicons and non-black `theme-color` for both smartphone apps.
- UI correction pass: applied `design.md` tokens to app shells with compact 8px glass surfaces, removed main-screen API connection badges/cards, reduced H1/H2 sizing, and added top-left hamburger menus.
- Added `/settings` pages for both independent apps. Backend connection status, feature detection, LIFF/PayPay runtime checks, Yamato credential checks, and shipped-status sync checks now live under the settings route.
- Fixed menu stacking after browser QA found the first content panel intercepting clicks on the settings link.
- Replaced preview/mock catalog and fulfillment data paths with Open Mercato Backend data access.
- `apps/jp-liff-order` now reads mobile catalog data from Backend `catalog/products`, creates starter catalog records when no mobile products exist, calculates price/stock server-side, creates `sales/orders`, records `sales/payments`, and calls `payment_gateways/sessions` with `providerKey: "paypay"`.
- `apps/jp-fulfillment-shipping` now reads actual `sales/orders`, maps mobile fulfillment metadata into picking tasks, calls `shipping-carriers/shipments` with `providerKey: "yamato"`, and writes shipment metadata back to the Backend order.
- Fixed `sales/payments` payload creation so the authoritative `amount` field stores the order total, not only the metadata `requestedAmount`.
- Generated a local Open Mercato API key named `jp-mobile-runtime-20260614145040` and saved it to ignored `.env.local` files for both independent apps. The secret value is intentionally not recorded in this run file.
- Added PayPay and Yamato credential environment variables to Docker Compose app services and `.env.example`, then regenerated Backend DI so `gateway_paypay` and `carrier_yamato` are registered in `apps/mercato/.mercato/generated/di.generated.ts`.
- Split the app color sets according to `design.md`: `jp-liff-order` now uses the light `Light Frost` palette, while `jp-fulfillment-shipping` uses the dark `Dark Operations` palette.
- Updated viewport theme colors so the LIFF browser chrome uses `#f3faf7` and the fulfillment browser chrome uses `#0b1113`.
- Rebalanced the entire color system around the provided blue palette: Alice Blue `#E9F5FF`, Jordy Blue `#93BFEF`, Tufts Blue `#468BE6`, and Cool Black `#092F64`.
- Updated `design.md` so the palette defines both `Light Blue Glass` for LIFF and `Dark Blue Operations` for fulfillment. `Tufts Blue #468BE6` is now the shared primary accent, while Alice/Jordy/Cool Black define the supporting background, surface, border, and text colors.

## Validation

- Passed: `corepack yarn install`.
- Passed: `corepack yarn workspaces foreach -A --include @open-mercato/jp-liff-order --include @open-mercato/jp-fulfillment-shipping --include @open-mercato/gateway-paypay --include @open-mercato/carrier-yamato run typecheck`.
- Passed: `corepack yarn workspaces foreach -A --include @open-mercato/jp-liff-order --include @open-mercato/jp-fulfillment-shipping --include @open-mercato/gateway-paypay --include @open-mercato/carrier-yamato run build`.
- Passed: `corepack yarn workspace @open-mercato/app typecheck`.
- Passed with unrelated blocker: `corepack yarn exec tsc -p packages/core/tsconfig.json --noEmit` reached a pre-existing error in `packages/core/src/modules/ecommerce/api/get/ecommerce/storefront/products/route.ts`.
- Passed: `GET http://127.0.0.1:3201` and `GET http://127.0.0.1:3202` returned HTTP 200.
- Passed: `POST http://127.0.0.1:3201/api/paypay-session` returned PayPay preview session when no backend token was configured.
- Passed: `POST http://127.0.0.1:3202/api/ship-order` returned Yamato preview label/tracking data when no backend token was configured.
- Passed: Playwright mobile viewport `390x844` screenshots were captured for both apps.
- Passed: Docker `docker compose up -d --build app` rebuilt `open-mercato/app:local-dev`.
- Passed after dependency resync: `docker compose exec app yarn install`, `docker compose restart app`, and `GET http://127.0.0.1:3100/api/docs/openapi`.
- Passed after UI correction: `corepack yarn workspaces foreach -A --include @open-mercato/jp-liff-order --include @open-mercato/jp-fulfillment-shipping run typecheck`.
- Passed after UI correction: `corepack yarn workspaces foreach -A --include @open-mercato/jp-liff-order --include @open-mercato/jp-fulfillment-shipping run build`.
- Passed after final restart: `GET/HEAD http://127.0.0.1:3201`, `http://127.0.0.1:3201/settings`, `http://127.0.0.1:3202`, and `http://127.0.0.1:3202/settings` returned HTTP 200.
- Passed browser QA at `390x844`: hamburger menu opens, settings navigation works, main screens no longer contain `API接続`, and primary heading sizes are 24px for H1 and 18-20px for H2.
- Passed latest Backend check: `docker compose ps app` shows `mercato-app` up on port 3100 and `GET/HEAD http://127.0.0.1:3100/api/docs/openapi` returns HTTP 200.
- Passed latest app typechecks: `npx tsc --noEmit` in `apps/jp-liff-order` and `apps/jp-fulfillment-shipping`.
- Passed latest app builds: `corepack yarn workspace @open-mercato/jp-liff-order build` and `corepack yarn workspace @open-mercato/jp-fulfillment-shipping build`.
- Passed: `docker compose config --quiet`.
- Passed: direct Backend request with the saved `.env.local` API key returned HTTP 200 for `GET http://127.0.0.1:3100/api/sales/orders`.
- Passed after app restart from `.env.local`: `GET http://127.0.0.1:3201/api/products` returned three Backend catalog products with stock values: `JP-LIFF-FIELD-KIT`, `JP-LIFF-AURORA-WRAP`, and `JP-LIFF-ATLAS-RUNNER`.
- Passed after app restart from `.env.local`: `GET http://127.0.0.1:3202/api/orders` returned a real Backend order queue containing `ORDER-20260614-00001`.
- Passed: `POST http://127.0.0.1:3202/api/ship-order` created a Backend carrier shipment. The latest `carrier_shipments` row has `provider_key = yamato`, `unified_status = label_created`, and tracking number `495186440847`.
- Observed Backend persistence counts after verification: `catalog_products = 7`, `sales_orders = 6`, `sales_payments = 7`, and `carrier_shipments = 1`.
- Passed production browser QA after switching 3201/3202 from `next dev` to `next start`: `http://127.0.0.1:3201` renders Backend products, calls `GET /api/products` with HTTP 200, and has zero console errors.
- Passed production browser QA after switching 3201/3202 from `next dev` to `next start`: `http://127.0.0.1:3202` renders the real order queue, calls `GET /api/orders` with HTTP 200, and has zero console errors.
- Passed after payment amount fix: `npx tsc --noEmit` in both independent apps.
- Passed after payment amount fix: `corepack yarn workspace @open-mercato/jp-liff-order build` with `TEMP/TMP=C:\tmp`.
- Passed after payment amount fix: `POST http://127.0.0.1:3201/api/paypay-session` returned HTTP 502 because PayPay production credentials are absent, while still creating real Backend `sales_orders` and `sales_payments` records.
- Passed after payment amount fix: latest `sales_payments` row stores `amount = 5840.0000`, `currency_code = JPY`; current counts are `sales_orders = 7` and `sales_payments = 8`.
- Passed after payment amount fix: `GET http://127.0.0.1:3202/api/orders` shows the new order `ORDER-20260614-00003` for fulfillment.
- Passed final production browser QA: `http://127.0.0.1:3201` calls `GET /api/products` with HTTP 200 and has zero console errors.
- Passed after color split: `corepack yarn workspace @open-mercato/jp-liff-order typecheck` and `corepack yarn workspace @open-mercato/jp-fulfillment-shipping typecheck`.
- Passed after color split: `corepack yarn workspace @open-mercato/jp-liff-order build` and `corepack yarn workspace @open-mercato/jp-fulfillment-shipping build`.
- Passed after color split browser QA at `390x844`: LIFF root CSS variables are `--glass-bg: #f3faf7`, `--glass-text: #10221c`, `--glass-accent: #1fa875`, with zero console errors.
- Passed after color split browser QA at `390x844`: fulfillment root CSS variables are `--glass-bg: #0b1113`, `--glass-text: #f4fbf8`, `--glass-accent: #7ad3ad`, with zero console errors.
- Passed after blue palette rebalance: `corepack yarn workspace @open-mercato/jp-liff-order typecheck` and `corepack yarn workspace @open-mercato/jp-fulfillment-shipping typecheck`.
- Passed after blue palette rebalance: `corepack yarn workspace @open-mercato/jp-liff-order build` and `corepack yarn workspace @open-mercato/jp-fulfillment-shipping build`.
- Passed after blue palette browser QA at `390x844`: LIFF root CSS variables are `--glass-bg: #e9f5ff`, `--glass-text: #092f64`, `--glass-accent: #468be6`; `GET /api/products` returned HTTP 200; console errors were zero.
- Passed after blue palette browser QA at `390x844`: fulfillment root CSS variables are `--glass-bg: #092f64`, `--glass-text: #e9f5ff`, `--glass-accent: #468be6`; `GET /api/orders` returned HTTP 200; console errors were zero.

## Runtime URLs

- LIFF order app: `http://127.0.0.1:3201`
- Fulfillment shipping app: `http://127.0.0.1:3202`
- Open Mercato Backend: `http://127.0.0.1:3100`

## Screenshots

- `D:\workspace\jp-liff-order-mobile-final.png`
- `D:\workspace\jp-fulfillment-shipping-mobile-final.png`
- `D:\workspace\jp-liff-order-home-fix.png`
- `D:\workspace\jp-liff-order-settings-menu-fix.png`
- `D:\workspace\jp-fulfillment-shipping-home-fix.png`
- `D:\workspace\jp-fulfillment-shipping-settings-menu-fix.png`
- `D:\workspace\projects\apps\open-mercato\docs\assets\jp-mobile-mvp\liff-order-light-theme.png`
- `D:\workspace\projects\apps\open-mercato\docs\assets\jp-mobile-mvp\fulfillment-shipping-dark-theme.png`
- `D:\workspace\projects\apps\open-mercato\docs\assets\jp-mobile-mvp\liff-order-blue-light.png`
- `D:\workspace\projects\apps\open-mercato\docs\assets\jp-mobile-mvp\fulfillment-shipping-blue-dark.png`

## Notes

- Docker initially entered a loop with `command not found: next` because the persistent `app_node_modules` volume and init marker skipped dependency re-linking after the workspace set changed. Running `docker compose exec app yarn install` and restarting `app` resolved the issue.
- The local Open Mercato Backend API key has been obtained and applied. It is stored only in ignored `.env.local` files and must not be committed.
- PayPay production use still requires actual PayPay for Developers credentials, webhook configuration, IP allowlisting where applicable, and provider-specific verification hardening. No non-empty `OM_INTEGRATION_PAYPAY_*` credentials were found in local env files.
- Yamato production use still requires the actual B2 Cloud/API contract details. No non-empty `OM_INTEGRATION_YAMATO_*` credentials were found in local env files. The current adapter supplies the Backend provider boundary and printable label/tracking record flow for MVP validation.
- LINE LIFF production use still requires a LINE Developers LIFF app ID and HTTPS endpoint registration. No non-empty `NEXT_PUBLIC_LINE_LIFF_ID` was found in local env files.
- External credential references checked on 2026-06-14: PayPay OPA Dynamic QR documentation, LINE Developers LIFF registration documentation, and Yamato Business shipping-label/API information.
- `next dev` on these independent apps showed repeated HMR WebSocket handshake failures in the in-app browser and did not hydrate the screen during QA. Running the already-built apps with `next start` removed the HMR path and passed browser QA. The current local runtime on ports 3201 and 3202 is production start.
