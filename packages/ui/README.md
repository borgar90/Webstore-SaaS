# @bfs/ui

A shared UI toolkit for the BFS storefront and admin surfaces. It provides design tokens along with a small collection of reusable React primitives.

## Installation

```bash
pnpm add @bfs/ui
```

`@bfs/ui` is compiled to plain ESM/CJS with React peer dependencies. Import components or tokens directly from the package entry point.

```tsx
import { Button, Card, Badge, tokens } from '@bfs/ui';
```

## Tokens

Design tokens live in `packages/ui/src/tokens.ts` and include spacing, colors, font sizing, and radii scales. They are exportable through the `tokens` object so each application can:

- Map values to CSS variables for runtime theming.
- Generate utility classes (e.g., with Tailwind `theme.extend`).
- Safely reference shared semantic values inside styled components.

Example token usage with CSS variables:

```tsx
const theme = {
  '--color-surface': tokens.colors.surface,
  '--radius-md': tokens.radii.md,
};

export function Shell(props: { children: React.ReactNode }) {
  return (
    <div style={theme}>
      {props.children}
    </div>
  );
}
```

## Components

### Button

A semantic button that supports `variant` (`primary`, `secondary`, `ghost`) and `size` (`sm`, `md`, `lg`). Use it for all clickable actions to maintain consistent spacing and focus states.

```tsx
<Button variant="secondary" size="sm" onClick={handleEdit}>
  Edit product
</Button>
```

### Card

Flexible container that wraps content with shared padding, border radius, and shadow tokens. Ideal for dashboard tiles or grouped product details.

```tsx
<Card title="Inventory">
  <p>18 units remaining</p>
</Card>
```

### Badge

Inline label component with `variant` support (`default`, `success`, `info`, `warning`). Useful for status indicators, feature tags, and merchandising flags.

```tsx
<Badge variant="success">In Stock</Badge>
```

## Theming Guidelines

- Prefer updating token values (or mapping them to CSS variables) instead of restyling each component individually.
- When extending variants, create wrappers in the consuming app that compose the exported primitives so shared defaults remain intact.
- Keep typography consistent by referencing the `tokens.font` scale for new components.
- Document any app-specific overrides in the respective project README to avoid divergence.

## Local Development

The package is built with `tsup`. During development you can run:

```bash
pnpm --filter @bfs/ui dev
```

Run `pnpm --filter @bfs/ui build` before publishing to ensure type declarations and bundled output are up to date.
