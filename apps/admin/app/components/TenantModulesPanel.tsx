'use client';

import { useCallback, useMemo } from 'react';
import { Button } from '@bfs/ui';
import { useTenant } from '@bfs/utils/react';
import { mapTenantModules } from '../lib/moduleMetadata';
import { ModuleToggleList } from './ModuleToggleList';
import { PageHeader } from './PageHeader';

export function TenantModulesPanel() {
  const { tenant, isLoading, error, refresh } = useTenant();

  const modules = useMemo(() => (tenant ? mapTenantModules(tenant) : []), [tenant]);

  const handleRefresh = useCallback(() => {
    void refresh().catch(() => undefined);
  }, [refresh]);

  return (
    <main className="page-stack">
      <PageHeader
        title="Modules"
        description="Toggle functionality per tenant and plan upcoming releases."
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
              Refresh
            </Button>
            <Button variant="primary" size="sm" type="button">
              Add new module
            </Button>
          </>
        }
      />
      <ModuleToggleList modules={modules} isLoading={isLoading} error={error} />
    </main>
  );
}
