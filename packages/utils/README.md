# @bfs/utils

Shared runtime utilities and type definitions used across the BFS monorepo.

## Installation

```bash
pnpm add @bfs/utils
```

## Features

- Module metadata helpers for addon registration (`resolveModuleSelection`).
- Tenant configuration helpers (`DEFAULT_TENANT_ID`, `resolveApiBaseUrl`).
- Shared catalog and module type definitions.
- React client hooks exposed through the `@bfs/utils/react` entry point.

## React Hooks

Import data-fetching hooks from the React-specific entry point to keep the base utils bundle framework-agnostic:

```tsx
'use client';

import { useCatalog, useTenant } from '@bfs/utils/react';

export function TenantBadge() {
  const { tenant, isLoading } = useTenant();

  if (isLoading) {
    return <span>Loading tenant…</span>;
  }

  return <span>{tenant?.domain ?? 'unknown'}</span>;
}
```

`useCatalog` returns `{ data, status, error, refresh }` where `data` includes both categories and products for the active tenant. Pass `tenantId` or `baseUrl` overrides when working with preview environments.

```tsx
const { data, refresh } = useCatalog({ tenantId: 'demo-store' });
```

Both hooks:

- Default to `DEFAULT_TENANT_ID`.
- Use `resolveApiBaseUrl()` to respect environment variables.
- Expose `refresh()` for manual revalidation.
- Track `status` (`idle`, `loading`, `success`, `error`) and friendly booleans (`isLoading`, `isError`).

## Building

```bash
pnpm --filter @bfs/utils build
```

This outputs ESM and CJS bundles plus type declarations for both the base utilities and the React hooks entry point.
