'use client';

import { DEFAULT_TENANT_ID, resolveApiBaseUrl } from '@bfs/utils';
import { FormEvent, useState } from 'react';

interface CatalogCategory {
  id: string;
  name: string;
  description?: string;
}

interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  imageLabel: string;
  badge?: string;
  rating?: number;
}

interface CatalogManagerProps {
  tenantId?: string;
  initialCategories: CatalogCategory[];
  initialProducts: CatalogProduct[];
}

const API_BASE_URL = resolveApiBaseUrl();

async function extractErrorMessage(response: Response) {
  try {
    const payload = await response.json();
    const message = Array.isArray(payload?.message)
      ? payload.message.join(' ')
      : payload?.message ?? payload?.error;
    if (message) {
      return message;
    }
  } catch (error) {
    console.warn('Failed to parse error response', error);
  }

  return `Request failed with status ${response.status}`;
}

export function CatalogManager({ tenantId = DEFAULT_TENANT_ID, initialCategories, initialProducts }: CatalogManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'NOK',
    categoryId: initialCategories[0]?.id ?? '',
    imageLabel: '',
    badge: '',
    rating: '',
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryForm.name.trim()) {
      setError('Category name is required.');
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}/catalog/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryForm.name.trim(), description: categoryForm.description.trim() || undefined }),
      });

      if (!response.ok) {
        throw new Error(await extractErrorMessage(response));
      }

      const category = (await response.json()) as CatalogCategory;
      setCategories((current) => [...current, category]);
      setProductForm((state) =>
        state.categoryId ? state : { ...state, categoryId: category.id },
      );
      setCategoryForm({ name: '', description: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setPending(false);
    }
  };

  const handleProductSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productForm.name.trim() || !productForm.categoryId) {
      setError('Product name and category are required.');
      return;
    }

    const price = Number(productForm.price);
    if (Number.isNaN(price) || price <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}/catalog/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productForm.name.trim(),
          description: productForm.description.trim(),
          price,
          currency: productForm.currency,
          categoryId: productForm.categoryId,
          imageLabel: productForm.imageLabel.trim() || productForm.name.trim(),
          badge: productForm.badge.trim() || undefined,
          rating: productForm.rating ? Number(productForm.rating) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(await extractErrorMessage(response));
      }

      const product = (await response.json()) as CatalogProduct;
      setProducts((current) => [...current, product]);
      setProductForm({
        name: '',
        description: '',
        price: '',
        currency: productForm.currency,
        categoryId: productForm.categoryId,
        imageLabel: '',
        badge: '',
        rating: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid-two">
      <section className="card">
        <header>
          <h2 className="card__title">Add category</h2>
          <p>Group products to power navigation and landing pages.</p>
        </header>
        <form onSubmit={handleCategorySubmit} className="form-grid">
          <label className="form-field">
            <span>Name</span>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(event) => setCategoryForm((state) => ({ ...state, name: event.target.value }))}
              placeholder="e.g. Seasonal" required
            />
          </label>
          <label className="form-field">
            <span>Description</span>
            <textarea
              value={categoryForm.description}
              onChange={(event) => setCategoryForm((state) => ({ ...state, description: event.target.value }))}
              placeholder="Optional context for editors"
              rows={3}
            />
          </label>
          <button className="button button--primary" type="submit" disabled={pending}>
            Save category
          </button>
        </form>
        <div>
          <strong>Existing categories</strong>
          <ul className="modules-list">
            {categories.map((category) => (
              <li key={category.id} className="module-row">
                <div className="module-row__meta">
                  <span className="module-row__name">{category.name}</span>
                  {category.description ? (
                    <p className="module-row__description">{category.description}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <header>
          <h2 className="card__title">Add product</h2>
          <p>Create a new product listing and assign categories.</p>
        </header>
        <form onSubmit={handleProductSubmit} className="form-grid">
          <label className="form-field">
            <span>Name</span>
            <input
              type="text"
              value={productForm.name}
              onChange={(event) => setProductForm((state) => ({ ...state, name: event.target.value }))}
              placeholder="Product name"
              required
            />
          </label>
          <label className="form-field">
            <span>Description</span>
            <textarea
              value={productForm.description}
              onChange={(event) => setProductForm((state) => ({ ...state, description: event.target.value }))}
              placeholder="Narrative to highlight benefits"
              rows={3}
              required
            />
          </label>
          <div className="grid-two">
            <label className="form-field">
              <span>Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={productForm.price}
                onChange={(event) => setProductForm((state) => ({ ...state, price: event.target.value }))}
                required
              />
            </label>
            <label className="form-field">
              <span>Currency</span>
              <input
                type="text"
                value={productForm.currency}
                onChange={(event) => setProductForm((state) => ({ ...state, currency: event.target.value.toUpperCase() }))}
                required
              />
            </label>
          </div>
          <label className="form-field">
            <span>Category</span>
            <select
              value={productForm.categoryId}
              onChange={(event) => setProductForm((state) => ({ ...state, categoryId: event.target.value }))}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Image label</span>
            <input
              type="text"
              value={productForm.imageLabel}
              onChange={(event) => setProductForm((state) => ({ ...state, imageLabel: event.target.value }))}
              placeholder="Placeholder label"
            />
          </label>
          <div className="grid-two">
            <label className="form-field">
              <span>Badge (optional)</span>
              <input
                type="text"
                value={productForm.badge}
                onChange={(event) => setProductForm((state) => ({ ...state, badge: event.target.value }))}
                placeholder="e.g. New, Bestseller"
              />
            </label>
            <label className="form-field">
              <span>Rating (optional)</span>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={productForm.rating}
                onChange={(event) => setProductForm((state) => ({ ...state, rating: event.target.value }))}
              />
            </label>
          </div>
          <button className="button button--primary" type="submit" disabled={pending}>
            Save product
          </button>
        </form>
        <div>
          <strong>Products</strong>
          <ul className="modules-list">
            {products.map((product) => (
              <li key={product.id} className="module-row">
                <div className="module-row__meta">
                  <span className="module-row__name">{product.name}</span>
                  <p className="module-row__description">{product.description}</p>
                </div>
                <span>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: product.currency,
                }).format(product.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
