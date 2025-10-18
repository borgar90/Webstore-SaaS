import { DEFAULT_TENANT_ID, resolveApiBaseUrl } from '@bfs/utils';
import { CatalogManager } from '../components/CatalogManager';
import { PageHeader } from '../components/PageHeader';

const FALLBACK_CATEGORIES = [
  {
    id: 'bath-and-body',
    name: 'Bath & Body',
    description: 'Hand-crafted soaps and skin treatments.',
  },
  {
    id: 'wellness',
    name: 'Wellness',
    description: 'Mindful scents and routines for calm living.',
  },
];

const FALLBACK_PRODUCTS = [
  {
    id: 'arctic-breeze',
    name: 'Arctic Breeze Soap Bar',
    description: 'Invigorating eucalyptus blend with glacial minerals.',
    price: 149,
    currency: 'NOK',
    categoryId: 'bath-and-body',
    imageLabel: 'Arctic Breeze',
    badge: 'Bestseller',
    rating: 4.7,
  },
  {
    id: 'midnight-ritual',
    name: 'Midnight Ritual Oil',
    description: 'Blue chamomile night oil for restorative sleep.',
    price: 329,
    currency: 'NOK',
    categoryId: 'wellness',
    imageLabel: 'Midnight Ritual',
    rating: 4.5,
  },
];

async function fetchCatalogData(tenantId: string) {
  const baseUrl = resolveApiBaseUrl();

  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetch(`${baseUrl}/tenants/${tenantId}/catalog/categories`, { cache: 'no-store' }),
      fetch(`${baseUrl}/tenants/${tenantId}/catalog/products`, { cache: 'no-store' }),
    ]);

    if (!categoriesResponse.ok || !productsResponse.ok) {
      throw new Error('Unable to load catalog data');
    }

    const [categories, products] = await Promise.all([
      categoriesResponse.json(),
      productsResponse.json(),
    ]);

    return { categories, products };
  } catch (error) {
    console.warn('Falling back to local catalog dataset', error);
    return {
      categories: FALLBACK_CATEGORIES.map((category) => ({ ...category })),
      products: FALLBACK_PRODUCTS.map((product) => ({ ...product })),
    };
  }
}

export default async function CatalogPage() {
  const { categories, products } = await fetchCatalogData(DEFAULT_TENANT_ID);

  return (
    <main className="page-stack">
      <PageHeader title="Catalog" description="Manage categories and products for the storefront." />
      <CatalogManager tenantId={DEFAULT_TENANT_ID} initialCategories={categories} initialProducts={products} />
    </main>
  );
}
