import { Injectable } from '@nestjs/common';
import type { ModuleResolutionResult, TenantConfig } from '@bfs/utils';
import { ModuleLoaderService } from './module-loader/module-loader.service';
import { TenantService } from './tenant/tenant.service';

@Injectable()
export class AppService {
  constructor(
    private readonly moduleLoader: ModuleLoaderService,
    private readonly tenantService: TenantService,
  ) {}

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async getTenantModules(tenantId: string): Promise<{
    tenant: Omit<TenantConfig, 'stripeKey'>;
    resolved: ModuleResolutionResult;
  }> {
    const tenant = await this.tenantService.getTenantConfig(tenantId);
    const { stripeKey: _stripeKey, ...publicTenant } = tenant;

    const resolved = this.moduleLoader.resolveModulesForTenant(tenant);

    return {
      tenant: {
        ...publicTenant,
        modules: [...publicTenant.modules],
      },
      resolved,
    };
  }
}
