import { Injectable } from '@nestjs/common';
import { addonModules, registerAddons } from '@bfs/addons';
import { coreModuleNames, coreModules } from '@bfs/core';
import {
  resolveModuleSelection,
  type ModuleManifest,
  type ModuleResolutionResult,
  type TenantConfig,
} from '@bfs/utils';

@Injectable()
export class ModuleLoaderService {
  private readonly coreRegistry: ModuleManifest[] = coreModules();
  private readonly addonRegistry: ModuleManifest[] = addonModules();

  listAvailableModules() {
    return {
      core: this.coreRegistry,
      addons: this.addonRegistry,
    };
  }

  resolveModulesForTenant(config: TenantConfig): ModuleResolutionResult {
    const normalized = this.normalizeTenantModules(config.modules);
    const available = [...this.coreRegistry, ...this.addonRegistry];
    return resolveModuleSelection(available, normalized);
  }

  resolveAddons(requested: string[]): ModuleResolutionResult {
    return registerAddons(requested);
  }

  private normalizeTenantModules(modules: string[]) {
    if (modules.includes('core')) {
      const unique = new Set([...modules, ...coreModuleNames()]);
      unique.delete('core');
      return Array.from(unique);
    }

    return modules;
  }
}
