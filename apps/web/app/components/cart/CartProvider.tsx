'use client';

import { DEFAULT_TENANT_ID, resolveApiBaseUrl } from '@bfs/utils';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  imageLabel: string;
  badge?: string;
}

export interface Cart {
  id: string;
  tenantId: string;
  items: CartItem[];
  currency: string;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

interface CartContextValue {
  cart: Cart | null;
  cartId: string | null;
  status: 'idle' | 'loading';
  error: string | null;
  itemCount: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

async function readError(response: Response): Promise<string> {
  try {
    const payload = await response.json();
    const message = Array.isArray(payload?.message)
      ? payload.message.join(' ')
      : payload?.message ?? payload?.error;
    if (message) {
      return message;
    }
  } catch (error) {
    console.warn('Failed to parse cart error response', error);
  }

  return `Request failed with status ${response.status}`;
}

export function CartProvider({
  children,
  tenantId = DEFAULT_TENANT_ID,
}: {
  children: ReactNode;
  tenantId?: string;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);
  const baseUrl = useMemo(() => resolveApiBaseUrl(), []);

  const ensureCartExists = useCallback(async () => {
    if (cart) {
      return cart;
    }

    const response = await fetch(`${baseUrl}/tenants/${tenantId}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(await readError(response));
    }

    const createdCart: Cart = await response.json();
    setCart(createdCart);
    return createdCart;
  }, [baseUrl, cart, tenantId]);

  const setPending = useCallback(() => {
    setStatus('loading');
    setError(null);
  }, []);

  const settle = useCallback((maybeError?: Error) => {
    if (maybeError) {
      setError(maybeError.message);
    }
    setStatus('idle');
  }, []);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      setPending();

      try {
        const activeCart = await ensureCartExists();

        const response = await fetch(`${baseUrl}/tenants/${tenantId}/cart/${activeCart.id}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
          throw new Error(await readError(response));
        }

        const nextCart: Cart = await response.json();
        setCart(nextCart);
      } catch (cause) {
        settle(cause instanceof Error ? cause : new Error('Unable to add item to cart.'));
        throw cause;
      }

      settle();
    },
    [baseUrl, ensureCartExists, settle, setPending, tenantId],
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      setPending();

      try {
        const activeCart = await ensureCartExists();
        const response = await fetch(
          `${baseUrl}/tenants/${tenantId}/cart/${activeCart.id}/items/${itemId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
          },
        );

        if (!response.ok) {
          throw new Error(await readError(response));
        }

        const nextCart: Cart = await response.json();
        setCart(nextCart);
      } catch (cause) {
        settle(cause instanceof Error ? cause : new Error('Unable to update cart item.'));
        throw cause;
      }

      settle();
    },
    [baseUrl, ensureCartExists, settle, setPending, tenantId],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      setPending();

      try {
        const activeCart = await ensureCartExists();
        const response = await fetch(
          `${baseUrl}/tenants/${tenantId}/cart/${activeCart.id}/items/${itemId}`,
          {
            method: 'DELETE',
          },
        );

        if (!response.ok) {
          throw new Error(await readError(response));
        }

        const nextCart: Cart = await response.json();
        setCart(nextCart);
      } catch (cause) {
        settle(cause instanceof Error ? cause : new Error('Unable to remove cart item.'));
        throw cause;
      }

      settle();
    },
    [baseUrl, ensureCartExists, settle, setPending, tenantId],
  );

  const itemCount = useMemo(
    () => cart?.items.reduce((count, item) => count + item.quantity, 0) ?? 0,
    [cart],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      cartId: cart?.id ?? null,
      status,
      error,
      itemCount,
      addItem,
      updateItem,
      removeItem,
      subtotal: cart?.subtotal ?? 0,
    }),
    [addItem, cart, error, itemCount, removeItem, status, updateItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
