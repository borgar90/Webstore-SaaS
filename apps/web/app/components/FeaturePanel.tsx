interface FeaturePanelProps {
  title: string;
  features: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  cta?: {
    label: string;
    href: string;
  };
}

export function FeaturePanel({ title, features, cta }: FeaturePanelProps) {
  return (
    <section className="feature-panel" id="why">
      <div>
        <h3 className="feature-panel__title">{title}</h3>
      </div>
      <ul className="feature-panel__list">
        {features.map((feature) => (
          <li key={feature.id} className="feature-panel__item">
            <strong>{feature.title}</strong>
            <span>{feature.description}</span>
          </li>
        ))}
      </ul>
      {cta ? (
        <a className="button button--primary" href={cta.href} id="newsletter">
          {cta.label}
        </a>
      ) : null}
    </section>
  );
}
