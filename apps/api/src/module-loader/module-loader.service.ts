import { Injectable } from '@nestjs/common';
import { addonModules, registerAddons } from '@bfs/addons';
import { coreModules } from '@bfs/core';
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
    const available = [...this.coreRegistry, ...this.addonRegistry];
    return resolveModuleSelection(available, config.modules);
  }

  resolveAddons(requested: string[]): ModuleResolutionResult {
    return registerAddons(requested);
  }
}
