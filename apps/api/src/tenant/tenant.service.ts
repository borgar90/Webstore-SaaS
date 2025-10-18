import { Injectable, NotFoundException } from '@nestjs/common';
import type { TenantConfig } from '@bfs/utils';

@Injectable()
export class TenantService {
  private readonly tenants = new Map<string, TenantConfig>([
    [
      'demo-store',
      {
        storeId: 'demo-store',
        modules: [
          'users',
          'products',
          'categories',
          'cart',
          'orders',
          'payments',
          'settings',
          'discount-codes',
          'newsletter',
        ],
        theme: 'neon-minimal',
        domain: 'demo.bfs.local',
        currency: 'USD',
        language: 'en',
        stripeKey: 'sk_test_placeholder',
        active: true,
      },
    ],
  ]);

  private readonly defaultTenantId = 'demo-store';

  async getTenantConfig(storeId: string): Promise<TenantConfig> {
    const config = this.tenants.get(storeId) ?? this.tenants.get(this.defaultTenantId);

    if (!config) {
      throw new NotFoundException(`Tenant '${storeId}' is not configured.`);
    }

    return {
      ...config,
      modules: [...config.modules],
    };
  }

  async resolveByHost(host?: string): Promise<TenantConfig> {
    if (!host) {
      return this.getDefaultTenant();
    }

    const normalizedHost = host.split(':')[0]?.toLowerCase();
    for (const config of this.tenants.values()) {
      if (config.domain.toLowerCase() === normalizedHost) {
        return {
          ...config,
          modules: [...config.modules],
        };
      }
    }

    return this.getDefaultTenant();
  }

  private getDefaultTenant(): TenantConfig {
    const config = this.tenants.get(this.defaultTenantId);
    if (!config) {
      throw new NotFoundException('No default tenant configured.');
    }

    return {
      ...config,
      modules: [...config.modules],
    };
  }
}
