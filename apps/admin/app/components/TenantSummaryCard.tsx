import { Badge, Button, Card, type BadgeVariant } from '@bfs/ui';

interface TenantSummaryCardProps {
  storeName?: string;
  domain?: string;
  plan?: string;
  lastDeployment?: string;
  activeModules?: number;
  theme?: string;
  status?: 'active' | 'inactive';
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void | Promise<void>;
}

export function TenantSummaryCard({
  storeName,
  domain,
  plan,
  lastDeployment,
  activeModules,
  theme,
  status,
  isLoading,
  error,
  onRefresh,
}: TenantSummaryCardProps) {
  const statusBadge: { label: string; variant: BadgeVariant } | null = status
    ? {
        label: status === 'active' ? 'Active' : 'Inactive',
        variant: status === 'active' ? 'success' : 'warning',
      }
    : null;

  return (
    <Card id="overview" aria-busy={isLoading} aria-live="polite">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <h2 className="card__title" style={{ margin: 0 }}>
            Tenant summary
          </h2>
          <p style={{ margin: 0, color: 'rgba(71, 85, 105, 0.9)' }}>
            High-level snapshot of your storefront configuration.
          </p>
        </div>
        {statusBadge ? <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge> : null}
      </header>
      {error ? (
        <p style={{ margin: 0, color: '#dc2626', fontWeight: 600 }}>Unable to load tenant details: {error}</p>
      ) : null}
      <div className="grid-two">
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Storefront</strong>
          <span>{storeName ?? '—'}</span>
          <span>{domain ?? '—'}</span>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Plan</strong>
          <span>{plan ?? '—'}</span>
          <span>{activeModules ?? 0} active modules</span>
        </div>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <strong>Last deployment</strong>
          <span>{lastDeployment ?? '—'}</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {theme ? <Badge variant="primary">Theme: {theme}</Badge> : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
