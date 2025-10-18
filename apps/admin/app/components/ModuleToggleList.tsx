import { Badge, Card } from '@bfs/ui';

interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  tags?: string[];
}

interface ModuleToggleListProps {
  modules: ModuleInfo[];
  isLoading?: boolean;
  error?: string | null;
}

const badgeVariantByTag: Record<string, 'primary' | 'success' | 'warning' | 'neutral' | 'danger'> = {
  addons: 'primary',
  marketing: 'primary',
  engagement: 'success',
  operations: 'warning',
};

export function ModuleToggleList({ modules, isLoading, error }: ModuleToggleListProps) {
  return (
    <Card id="modules">
      <header style={{ display: 'grid', gap: '0.35rem' }}>
        <h2 className="card__title" style={{ margin: 0 }}>
          Module configuration
        </h2>
        <p style={{ margin: 0, color: 'rgba(71, 85, 105, 0.9)' }}>
          Enable or disable storefront capabilities per tenant.
        </p>
        {error ? <Badge variant="warning">{error}</Badge> : null}
      </header>
      <div className="modules-list" aria-busy={isLoading}>
        {isLoading && modules.length === 0 ? (
          <div className="module-row">
            <div className="module-row__meta">
              <span className="module-row__name">Loading modules…</span>
              <p className="module-row__description">Fetching tenant module configuration.</p>
            </div>
            <span className="switch" role="status" aria-label="Loading" />
          </div>
        ) : null}
        {modules.map((module) => (
          <div key={module.id} className="module-row">
            <div className="module-row__meta">
              <span className="module-row__name">{module.name}</span>
              <p className="module-row__description">{module.description}</p>
              {module.tags?.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {module.tags.map((tag) => (
                    <Badge key={tag} variant={badgeVariantByTag[tag] ?? 'neutral'}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
            <span className={`switch${module.enabled ? ' switch--on' : ''}`} role="switch" aria-checked={module.enabled}>
              <span className="switch__thumb" />
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
