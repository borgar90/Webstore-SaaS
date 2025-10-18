export interface ModuleCapabilities {
  api?: boolean;
  admin?: boolean;
  storefront?: boolean;
}

export interface ModuleManifest {
  name: string;
  version: string;
  description?: string;
  routes?: string[];
  schema?: string[];
  ui?: {
    adminPanel?: boolean;
    customerWidget?: boolean;
  };
  capabilities: ModuleCapabilities;
  tags?: string[];
}

export interface TenantConfig {
  storeId: string;
  modules: string[];
  theme: string;
  domain: string;
  currency: string;
  language: string;
  stripeKey?: string;
  active: boolean;
}

export interface ModuleResolutionResult {
  enabled: ModuleManifest[];
  missing: string[];
}

export const resolveModuleSelection = (
  available: ModuleManifest[],
  requested: string[],
): ModuleResolutionResult => {
  const registry = new Map<string, ModuleManifest>(
    available.map((manifest) => [manifest.name, manifest]),
  );

  const enabled: ModuleManifest[] = [];
  const missing: string[] = [];

  requested.forEach((name) => {
    const manifest = registry.get(name);
    if (manifest) {
      enabled.push(manifest);
    } else if (name !== 'core') {
      // The "core" token is treated as a shortcut for all core modules.
      missing.push(name);
    }
  });

  return { enabled, missing };
};

export const compose = <T>(...fns: Array<(input: T) => T>) => {
  return (input: T) => fns.reduceRight((value, fn) => fn(value), input);
};
