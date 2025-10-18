import { addonModules } from '@bfs/addons';
import type { TenantConfig } from '@bfs/utils';

export interface ModuleListItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  tags?: string[];
}

const CORE_MODULE_METADATA: Record<string, { name: string; description: string; tags?: string[] }> = {
  users: {
    name: 'Users',
    description: 'Manage customer accounts, profiles, and authentication states.',
    tags: ['core'],
  },
  products: {
    name: 'Products',
    description: 'Maintain product catalog entries, variants, and merchandising metadata.',
    tags: ['core'],
  },
  categories: {
    name: 'Categories',
    description: 'Hierarchical category definitions for storefront navigation.',
    tags: ['core'],
  },
  cart: {
    name: 'Cart',
    description: 'Shopping cart API with session persistence and pricing calculations.',
    tags: ['core'],
  },
  orders: {
    name: 'Orders',
    description: 'Order capture, fulfillment status, and historical records.',
    tags: ['core'],
  },
  payments: {
    name: 'Payments',
    description: 'Payment orchestration, fraud tooling, and ledger integration.',
    tags: ['core'],
  },
  settings: {
    name: 'Settings',
    description: 'Tenant configuration, environment secrets, and rollout policies.',
    tags: ['core'],
  },
};

const toTitleCase = (slug: string) =>
  slug
    .split(/[-_]/)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');

const ADDON_MODULE_METADATA = addonModules().map((manifest) => ({
  id: manifest.name,
  name: toTitleCase(manifest.name),
  description: manifest.description ?? 'Composable addon module.',
  tags: ['addons', ...(manifest.tags ?? [])],
}));

export function mapTenantModules(tenant?: TenantConfig | null): ModuleListItem[] {
  const enabledModules = new Set(tenant?.modules ?? []);
  const modules: ModuleListItem[] = [];

  Object.entries(CORE_MODULE_METADATA).forEach(([id, meta]) => {
    modules.push({
      id,
      name: meta.name,
      description: meta.description,
      enabled: enabledModules.has(id),
      tags: meta.tags,
    });
    enabledModules.delete(id);
  });

  ADDON_MODULE_METADATA.forEach((addon) => {
    modules.push({
      id: addon.id,
      name: addon.name,
      description: addon.description,
      enabled: enabledModules.has(addon.id),
      tags: addon.tags,
    });
    enabledModules.delete(addon.id);
  });

  enabledModules.forEach((id) => {
    modules.push({
      id,
      name: toTitleCase(id),
      description: 'Custom module enabled for this tenant.',
      enabled: true,
      tags: ['custom'],
    });
  });

  return modules;
}
