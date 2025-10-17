# BFS Store Monorepo Scaffold

This repository provides an initial pnpm-based monorepo scaffold for the BFS modular webstore platform. It sets up placeholder applications for the storefront, admin dashboard, and API alongside shared packages for domain logic, add-ons, UI, utilities, and database access.

## Structure

- `apps/web` – Next.js storefront shell
- `apps/admin` – Next.js admin shell
- `apps/api` – NestJS API skeleton
- `packages/core` – core domain modules (products, orders, etc.)
- `packages/addons` – optional addon registry and loader
- `packages/ui` – shared UI primitives and styling
- `packages/utils` – cross-cutting utilities
- `packages/db` – Prisma schema and database helpers

## Getting Started

1. Install dependencies with `pnpm install` (requires pnpm v9+).
2. Generate environment files as needed (`.env`, `.env.local`).
3. Run `pnpm dev --filter @bfs/web` (or `@bfs/admin`, `@bfs/api`) to start each app once the respective frameworks are installed.

The placeholder code intentionally omits detailed implementations so you can layer in domain modules, tenancy logic, and SaaS capabilities iteratively.
