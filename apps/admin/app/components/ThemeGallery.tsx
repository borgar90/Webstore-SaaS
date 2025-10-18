interface ThemeGalleryProps {
  themes: Array<{
    id: string;
    name: string;
    status: 'active' | 'draft';
    description: string;
  }>;
}

export function ThemeGallery({ themes }: ThemeGalleryProps) {
  return (
    <section className="card" id="themes">
      <header>
        <h2 className="card__title">Theme library</h2>
        <p>Preview storefront themes before publishing to production.</p>
      </header>
      <div className="theme-grid">
        {themes.map((theme) => (
          <article key={theme.id} className="theme-card">
            <div className="theme-card__preview">{theme.name}</div>
            <div className="theme-card__footer">
              <span>{theme.status === 'active' ? 'Active' : 'Draft'}</span>
              <button className="button button--ghost" type="button">
                Edit
              </button>
            </div>
            <p>{theme.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
