interface ActivityTimelineProps {
  items: Array<{
    id: string;
    title: string;
    timestamp: string;
    actor: string;
  }>;
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <section className="card" id="activity">
      <header>
        <h2 className="card__title">Recent activity</h2>
        <p>Track key changes applied by your team.</p>
      </header>
      <div className="timeline">
        {items.map((item) => (
          <div key={item.id} className="timeline__item">
            <span className="timeline__title">{item.title}</span>
            <span className="timeline__meta">{item.timestamp}</span>
            <span className="timeline__meta">{item.actor}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
