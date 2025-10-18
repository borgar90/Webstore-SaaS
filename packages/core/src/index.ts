import type { ModuleManifest } from '@bfs/utils';

const CORE_MODULES: ModuleManifest[] = [
  {
    name: 'users',
    version: '0.1.0',
    description: 'Tenant user accounts and authentication flows',
    routes: ['/api/users'],
    schema: ['User', 'Role', 'UserRole'],
    capabilities: {
      api: true,
      admin: true,
    },
    tags: ['core', 'identity'],
  },
  {
    name: 'products',
    version: '0.1.0',
    description: 'Product catalog and merchandising tooling',
    routes: ['/api/products'],
    schema: ['Product', 'ProductVariant', 'ProductMedia'],
    capabilities: {
      api: true,
      storefront: true,
      admin: true,
    },
    tags: ['core', 'catalog'],
  },
  {
    name: 'categories',
    version: '0.1.0',
    description: 'Hierarchical product categorisation',
    routes: ['/api/categories'],
    schema: ['Category'],
    capabilities: {
      api: true,
      storefront: true,
      admin: true,
    },
    tags: ['core', 'catalog'],
  },
  {
    name: 'cart',
    version: '0.1.0',
    description: 'Persistent shopping cart and session management',
    routes: ['/api/cart'],
    schema: ['Cart', 'CartLine'],
    capabilities: {
      api: true,
      storefront: true,
    },
    tags: ['core', 'checkout'],
  },
  {
    name: 'orders',
    version: '0.1.0',
    description: 'Order lifecycle management and fulfillment hooks',
    routes: ['/api/orders'],
    schema: ['Order', 'OrderItem', 'OrderStatus'],
    capabilities: {
      api: true,
      storefront: true,
      admin: true,
    },
    tags: ['core', 'checkout'],
  },
  {
    name: 'payments',
    version: '0.1.0',
    description: 'Payment orchestration for tenant storefronts',
    routes: ['/api/payments'],
    schema: ['Payment', 'PaymentProvider'],
    capabilities: {
      api: true,
      admin: true,
    },
    tags: ['core', 'checkout'],
  },
  {
    name: 'settings',
    version: '0.1.0',
    description: 'Tenant-level configuration storage',
    routes: ['/api/settings'],
    schema: ['TenantSetting'],
    capabilities: {
      api: true,
      admin: true,
    },
    tags: ['core', 'settings'],
  },
];

export const coreModules = () => CORE_MODULES;

export const coreModuleNames = () => CORE_MODULES.map((module) => module.name);
