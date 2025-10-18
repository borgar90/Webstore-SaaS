import { Badge, Card } from '@bfs/ui';

interface MetricTilesProps {
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    change?: string;
  }>;
  isLoading?: boolean;
  error?: string | null;
}

export function MetricTiles({ metrics, isLoading, error }: MetricTilesProps) {
  const fallbackTiles = isLoading ? Array.from({ length: Math.max(metrics.length, 3) }, (_, index) => index) : [];

  return (
    <Card>
      <header style={{ display: 'grid', gap: '0.35rem' }}>
        <h2 className="card__title" style={{ margin: 0 }}>
          Storefront metrics
        </h2>
        <p style={{ margin: 0, color: 'rgba(71, 85, 105, 0.9)' }}>
          Key health indicators across traffic, orders, and revenue.
        </p>
        {error ? <Badge variant="warning">{error}</Badge> : null}
      </header>
      <div className="metrics">
        {fallbackTiles.length > 0
          ? fallbackTiles.map((token) => (
              <div key={`metric-skeleton-${token}`} className="metric-tile">
                <span className="metric-tile__label">Loading…</span>
                <span className="metric-tile__value">—</span>
              </div>
            ))
          : metrics.map((metric) => (
              <div key={metric.id} className="metric-tile">
                <span className="metric-tile__label">{metric.label}</span>
                <span className="metric-tile__value">{metric.value}</span>
                {metric.change ? <span>{metric.change}</span> : null}
              </div>
            ))}
      </div>
    </Card>
  );
}
