'use client';

import { Badge } from '@bfs/ui';
import { AddToCartButton } from './AddToCartButton';

export interface Product {
  id: string;
  name: string;
  price: string;
  unitPrice: number;
  currency: string;
  description: string;
  imageLabel: string;
  badge?: string;
  rating: number;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
  {product.badge ? <Badge variant="primary">{product.badge}</Badge> : null}
      <div className="product-card__media" aria-hidden>
        {product.imageLabel}
      </div>
      <div>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
      </div>
      <div className="product-card__footer">
        <div className="product-card__meta">
          <span>{product.price}</span>
          <span aria-label={`Rated ${product.rating} out of 5`}>
            {product.rating.toFixed(1)} / 5
          </span>
        </div>
        <AddToCartButton productId={product.id} />
      </div>
    </article>
  );
}
