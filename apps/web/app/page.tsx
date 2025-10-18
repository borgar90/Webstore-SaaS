import { DEFAULT_TENANT_ID, resolveApiBaseUrl } from '@bfs/utils';
import { CartProvider } from './components/cart/CartProvider';
import { CartSummary } from './components/cart/CartSummary';
import { CategoryList } from './components/CategoryList';
import type { Category } from './components/CategoryPill';
import { FeaturePanel } from './components/FeaturePanel';
import { ProductGrid } from './components/ProductGrid';
import type { Product } from './components/ProductCard';

export const revalidate = 0;

type CatalogCategoryResponse = {
  id: string;
  name: string;
  description?: string;
};

type CatalogProductResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  imageLabel: string;
  badge?: string;
  rating?: number;
};

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'product-01',
    name: 'Nordic Sea Salt Scrub',
    price: '$28.00',
    unitPrice: 28,
    currency: 'USD',
    description: 'Mineral-packed exfoliant hand blended for weekly rituals.',
    imageLabel: 'Sea Salt Scrub',
    badge: 'Bestseller',
    rating: 4.8,
  },
  {
    id: 'product-02',
    name: 'Aurora Soy Candle',
    price: '$34.00',
    unitPrice: 34,
    currency: 'USD',
    description: 'Slow-burning candle with cedarwood and citrus accords.',
    imageLabel: 'Aurora Candle',
    rating: 4.6,
  },
  {
    id: 'product-03',
    name: 'Midnight Bloom Serum',
    price: '$48.00',
    unitPrice: 48,
    currency: 'USD',
    description: 'Nightly serum with botanicals and ceramides for balance.',
    imageLabel: 'Bloom Serum',
    rating: 4.9,
  },
  {
    id: 'product-04',
    name: 'Glacier Clay Mask',
    price: '$32.00',
    unitPrice: 32,
    currency: 'USD',
    description: 'Cooling clay mask to clarify and refresh tired skin.',
    imageLabel: 'Clay Mask',
    badge: 'New',
    rating: 4.7,
  },
  {
    id: 'product-05',
    name: 'Hearthside Mug Set',
    price: '$42.00',
    unitPrice: 42,
    currency: 'USD',
    description: 'Hand-thrown ceramic mugs fired with a matte glaze.',
    imageLabel: 'Mug Set',
    rating: 4.5,
  },
  {
    id: 'product-06',
    name: 'Atlas Linen Throw',
    price: '$68.00',
    unitPrice: 68,
    currency: 'USD',
    description: 'Layerable linen throw with fringed edges and soft drape.',
    imageLabel: 'Linen Throw',
    rating: 4.6,
  },
];

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'skincare', label: 'skincare', count: 24 },
  { id: 'homeware', label: 'homeware', count: 18 },
  { id: 'wellness', label: 'wellness', count: 12 },
  { id: 'gifting', label: 'gifting', count: 9 },
];

const storefrontHighlights = [
  {
    id: 'modules',
    title: 'Composable modules',
    description: 'Toggle loyalty programs, reviews, and bundles per tenant without redeploying.',
  },
  {
    id: 'themes',
    title: 'Theme guardrails',
    description: 'Curate on-brand experiences with theme tokens that work across stores.',
  },
  {
    id: 'checkout',
    title: 'Trusted checkout',
    description: 'Stripe-powered checkout with adaptive fraud controls and tax support.',
  },
];

async function loadCatalog(tenantId: string): Promise<{ products: Product[]; categories: Category[] }> {
  const baseUrl = resolveApiBaseUrl();

  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetch(`${baseUrl}/tenants/${tenantId}/catalog/categories`, { cache: 'no-store' }),
      fetch(`${baseUrl}/tenants/${tenantId}/catalog/products`, { cache: 'no-store' }),
    ]);

    if (!categoriesResponse.ok || !productsResponse.ok) {
      throw new Error('Failed to fetch catalog dataset');
    }

    const [categoryPayload, productPayload] = await Promise.all([
      categoriesResponse.json() as Promise<CatalogCategoryResponse[]>,
      productsResponse.json() as Promise<CatalogProductResponse[]>,
    ]);

    const productCountByCategory = productPayload.reduce<Record<string, number>>((acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] ?? 0) + 1;
      return acc;
    }, {});

    const products = productPayload.map<Product>((product) => ({
      id: product.id,
      name: product.name,
      price: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: product.currency,
      }).format(product.price),
      unitPrice: product.price,
      currency: product.currency,
      description: product.description,
      imageLabel: product.imageLabel,
      badge: product.badge,
      rating: product.rating ?? 4.5,
    }));

    const categories = categoryPayload.map<Category>((category) => ({
      id: category.id,
      label: category.name,
      count: productCountByCategory[category.id] ?? 0,
    }));

    return { products, categories };
  } catch {
    return { products: FALLBACK_PRODUCTS, categories: FALLBACK_CATEGORIES };
  }
}

export default async function HomePage() {
  const { products, categories } = await loadCatalog(DEFAULT_TENANT_ID);

  return (
    <CartProvider tenantId={DEFAULT_TENANT_ID}>
      <main>
        <section className="container hero">
          <div>
            <span className="hero__badge">Tenant-aware commerce</span>
            <h1 className="hero__title">Launch curated storefronts in minutes.</h1>
            <p className="hero__subtitle">
              Spin up branded storefronts, sync inventory across tenants, and orchestrate feature rollouts from a single
              control plane.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#products">
                View featured products
              </a>
              <a className="button button--ghost" href="#why">
                Explore the stack
              </a>
            </div>
          </div>
          <FeaturePanel
            title="Built for fast-moving merchants"
            features={storefrontHighlights}
            cta={{ label: 'Access full demo', href: '#newsletter' }}
          />
        </section>

        <section className="section" aria-labelledby="products-heading">
          <div className="container">
            <div className="section__header">
              <div>
                <h2 className="section__title" id="products-heading">
                  Featured products
                </h2>
                <p className="section__subtitle">
                  Handpicked items from the demo catalog to showcase modular merchandising blocks.
                </p>
              </div>
              <a className="site-header__cta" href="#products">
                Browse all products →
              </a>
            </div>
            <ProductGrid products={products} />
          </div>
        </section>

        <section className="section" aria-labelledby="category-heading">
          <div className="container">
            <div className="section__header">
              <div>
                <h2 className="section__title" id="category-heading">
                  Shop by category
                </h2>
                <p className="section__subtitle">
                  Surface curated collections or automate category boosts per tenant segment.
                </p>
              </div>
            </div>
            <CategoryList categories={categories} />
          </div>
        </section>
      </main>
      <CartSummary />
    </CartProvider>
  );
}
