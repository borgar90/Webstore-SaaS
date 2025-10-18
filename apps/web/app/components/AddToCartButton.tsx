'use client';

import { Button } from '@bfs/ui';
import { useState } from 'react';
import { useCart } from './cart/CartProvider';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
}

export function AddToCartButton({ productId, quantity = 1 }: AddToCartButtonProps) {
  const { addItem, status } = useCart();
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);
    try {
      await addItem(productId, quantity);
    } catch (error) {
      console.error('Failed to add item to cart', error);
    } finally {
      setIsPending(false);
    }
  };

  const disabled = isPending || status === 'loading';

  return (
    <Button
      type="button"
      variant="primary"
      size="sm"
      fullWidth
      onClick={handleClick}
      disabled={disabled}
    >
      {disabled ? 'Adding...' : 'Add to cart'}
    </Button>
  );
}
