'use client';

import { useCallback, useMemo } from 'react';
import { Button } from '@bfs/ui';
import { useCatalog, useTenant } from '@bfs/utils/react';
import { MetricTiles } from './MetricTiles';
import { ModuleToggleList } from './ModuleToggleList';
import { PageHeader } from './PageHeader';
import { TenantSummaryCard } from './TenantSummaryCard';
import { mapTenantModules } from '../lib/moduleMetadata';

const FALLBACK_PLAN = 'Scale (tenant-isolated DB)';
const FALLBACK_DEPLOYMENT = 'Deployed 2 hours ago by sofia@bfs.dev';

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const toTitleCase = (slug: string) =>
  slug
    .split(/[-_]/)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');

export function TenantOverview() {
  const {
    tenant,
    isLoading: tenantLoading,
    error: tenantError,
    refresh: refreshTenant,
  } = useTenant();
  const {
    data: catalog,
    isLoading: catalogLoading,
    error: catalogError,
    refresh: refreshCatalog,
  } = useCatalog();

  const modules = useMemo(() => (tenant ? mapTenantModules(tenant) : []), [tenant]);

  const metrics = useMemo(() => {
    const products = catalog?.products ?? [];
    const categories = catalog?.categories ?? [];
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const averagePrice = totalProducts
      ? products.reduce((sum, product) => sum + product.price, 0) / totalProducts
      : 0;

    return [
      {
        id: 'products',
        label: 'Products',
        value: String(totalProducts),
        change: totalCategories ? `${totalCategories} categories` : undefined,
      },
      {
        id: 'avg-price',
        label: 'Average price',
        value: totalProducts ? formatCurrency(averagePrice, tenant?.currency ?? 'USD') : '—',
        change: tenant?.currency ? tenant.currency : undefined,
      },
      {
        id: 'modules',
        label: 'Active modules',
        value: String(tenant?.modules.length ?? 0),
        change: tenant?.theme ? `Theme: ${toTitleCase(tenant.theme)}` : undefined,
      },
      {
        id: 'status',
        label: 'Tenant status',
        value: tenant?.active ? 'Operational' : 'Paused',
        change: tenant?.domain,
      },
    ];
  }, [catalog, tenant]);

  const handleRefresh = useCallback(() => {
    void Promise.all([refreshTenant(), refreshCatalog()]).catch(() => undefined);
  }, [refreshCatalog, refreshTenant]);

  const storeName = tenant ? toTitleCase(tenant.storeId) : 'Demo Store';
  const plan = tenant?.modules.length && tenant.modules.length > 8 ? FALLBACK_PLAN : 'Growth (shared cluster)';
  const themeLabel = tenant?.theme ? toTitleCase(tenant.theme) : undefined;

  return (
    <main className="page-stack">
      <PageHeader
        title="Overview"
        description="Monitor tenant performance and deployment health at a glance."
        actions={
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={tenantLoading || catalogLoading}>
            Refresh data
          </Button>
        }
      />
      <TenantSummaryCard
        storeName={storeName}
        domain={tenant?.domain}
        plan={plan}
        lastDeployment={FALLBACK_DEPLOYMENT}
        activeModules={tenant?.modules.length ?? 0}
        theme={themeLabel}
        status={tenant ? (tenant.active ? 'active' : 'inactive') : undefined}
        isLoading={tenantLoading}
        error={tenantError}
        onRefresh={handleRefresh}
      />
      <MetricTiles metrics={metrics} isLoading={catalogLoading} error={catalogError} />
      <ModuleToggleList modules={modules} isLoading={tenantLoading} error={tenantError} />
    </main>
  );
}
