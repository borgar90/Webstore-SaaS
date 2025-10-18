import { ActivityTimeline } from '../components/ActivityTimeline';
import { MetricTiles } from '../components/MetricTiles';
import { PageHeader } from '../components/PageHeader';
import { activity, metrics } from '../data/mockTenant';

export default function ActivityPage() {
  return (
    <main>
      <PageHeader
        title="Activity"
        description="Audit module changes, deployments, and configuration updates."
      />
      <div className="grid-two">
        <ActivityTimeline items={activity} />
        <MetricTiles metrics={metrics.slice(0, 2)} />
      </div>
    </main>
  );
}
