Backend Enhancements

Seed multiple tenants, richer catalog data, and cross-tenant variations (currencies, feature toggles).
Persist data via PostgreSQL/Prisma (moving from in-memory) and provide fixture seeds.
Extend cart checkout flow: shipping/billing details, order creation, webhooks for status.
Storefront Experience

Build a complete browse → cart → checkout journey: dedicated cart page/drawer, checkout form, order confirmation, and account order history.
Add dynamic merchandising (home page hero blocks, category highlights, promotions) sourced from the seeded catalog.
Implement SEO and performance touches: dynamic metadata, structured data, image optimization.
Admin Console

Replace mock data with live APIs; add catalog CRUD, pricing, inventory management, theme configuration, and cart/order monitoring.
Provide module toggles that actually flip features (e.g., reviews, loyalty) in the frontend.
Shared UI & Packages

- [x] Audit existing admin/web components for candidates to share.
	- Candidates: `apps/admin/app/components/PageHeader`, `TenantSummaryCard`, `SidebarNav`, and `ModuleToggleList`; `apps/web/app/components/ProductCard`, `ProductGrid`, `FeaturePanel`, and `cart/CartSummary`.
- [x] Establish design tokens in `packages/ui` (colors, spacing, typography).
- [x] Build core primitives (`Button`, `Card`, `Badge`) and export from `@bfs/ui`.
- [x] Document usage patterns and theming guidelines (see `packages/ui/README.md`).
- [x] Provide shared data hooks (`useTenant`, `useCatalog`) for Next apps via `@bfs/utils/react`.
Dev Workflow

Add end-to-end tests (Playwright/Cypress) covering a full shopper journey.
Configure GitHub Actions pipeline (lint/test/build) with .env conventions.