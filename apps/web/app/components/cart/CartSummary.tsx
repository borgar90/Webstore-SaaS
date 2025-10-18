'use client';

import { useMemo } from 'react';
import { useCart } from './CartProvider';

export function CartSummary() {
  const { cart, itemCount, subtotal, status, error } = useCart();
  const currency = cart?.currency ?? 'NOK';

  const formattedSubtotal = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(subtotal),
    [currency, subtotal],
  );

  const isEmpty = itemCount === 0;

  if (isEmpty && status === 'idle' && !error) {
    return null;
  }

  return (
    <aside className="cart-summary" aria-live="polite">
      <div className="cart-summary__row">
        <span className="cart-summary__label">Cart</span>
        <span className="cart-summary__value">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
      </div>
      <div className="cart-summary__row">
        <span className="cart-summary__label">Subtotal</span>
        <span className="cart-summary__value">{formattedSubtotal}</span>
      </div>
  {status === 'loading' ? <p className="cart-summary__status">Updating cart...</p> : null}
      {error ? <p className="cart-summary__error">{error}</p> : null}
    </aside>
  );
}
