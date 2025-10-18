import { resolveModuleSelection, type ModuleManifest } from '@bfs/utils';

const ADDON_MODULES: ModuleManifest[] = [
  {
    name: 'discount-codes',
    version: '0.1.0',
    description: 'Promotional discounts and coupon management',
    routes: ['/api/discount-codes'],
    schema: ['DiscountCode', 'DiscountRedemption'],
    capabilities: {
      api: true,
      admin: true,
      storefront: true,
    },
    tags: ['addons', 'marketing'],
  },
  {
    name: 'reviews',
    version: '0.1.0',
    description: 'Customer product reviews and moderation',
    routes: ['/api/reviews'],
    schema: ['Review'],
    capabilities: {
      api: true,
      storefront: true,
    },
    tags: ['addons', 'engagement'],
  },
  {
    name: 'newsletter',
    version: '0.1.0',
    description: 'Newsletter signup capture and sync jobs',
    routes: ['/api/newsletter'],
    schema: ['NewsletterSubscriber'],
    capabilities: {
      api: true,
      storefront: true,
      admin: true,
    },
    tags: ['addons', 'marketing'],
  },
  {
    name: 'inventory',
    version: '0.1.0',
    description: 'Inventory management and stock alerts',
    routes: ['/api/inventory'],
    schema: ['InventoryItem', 'InventoryAdjustment'],
    capabilities: {
      api: true,
      admin: true,
    },
    tags: ['addons', 'operations'],
  },
];

export const addonModules = () => ADDON_MODULES;

export const registerAddons = (requested: string[]) =>
  resolveModuleSelection(ADDON_MODULES, requested);
