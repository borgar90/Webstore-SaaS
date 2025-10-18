import { PageHeader } from '../components/PageHeader';
import { ThemeGallery } from '../components/ThemeGallery';
import { themes } from '../data/mockTenant';

export default function ThemesPage() {
  return (
    <main>
      <PageHeader
        title="Themes"
        description="Preview, edit, and publish storefront themes for this tenant."
        actions={
          <button className="button button--primary" type="button">
            Launch theme editor
          </button>
        }
      />
      <ThemeGallery themes={themes} />
    </main>
  );
}
