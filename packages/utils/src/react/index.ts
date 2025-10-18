import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_TENANT_ID, resolveApiBaseUrl, type TenantConfig } from '../index';
import type { CatalogCategory, CatalogProduct } from '../catalog';

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

async function readErrorMessage(response: Response) {
  try {
    const payload = await response.json();
    const message = Array.isArray(payload?.message)
      ? payload.message.join(' ')
      : payload?.message ?? payload?.error;
    if (message) {
      return message as string;
    }
  } catch (error) {
    console.warn('Failed to parse API error response', error);
  }

  return `Request failed with status ${response.status}`;
}

export interface UseTenantOptions {
  tenantId?: string;
  baseUrl?: string;
  lazy?: boolean;
}

export interface UseTenantResult {
  tenant: TenantConfig | null;
  status: AsyncStatus;
  error: string | null;
  isLoading: boolean;
  isError: boolean;
  refresh: () => Promise<TenantConfig>;
  tenantId: string;
}

export function useTenant(options: UseTenantOptions = {}): UseTenantResult {
  const requestedTenantId = options.tenantId ?? DEFAULT_TENANT_ID;
  const baseUrl = useMemo(() => options.baseUrl ?? resolveApiBaseUrl(), [options.baseUrl]);
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const tenantIdRef = useRef(requestedTenantId);
  const mountedRef = useRef(true);
  const requestRef = useRef(0);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  useEffect(() => {
    tenantIdRef.current = requestedTenantId;
  }, [requestedTenantId]);

  const fetchTenant = useCallback(
    async (targetTenantId: string = tenantIdRef.current) => {
      const requestId = ++requestRef.current;

      if (mountedRef.current) {
        setStatus('loading');
        setError(null);
      }

      try {
        const response = await fetch(`${baseUrl}/tenants/${targetTenantId}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(await readErrorMessage(response));
        }

        const payload = (await response.json()) as TenantConfig;

        if (!mountedRef.current || requestId !== requestRef.current) {
          return payload;
        }

        setTenant(payload);
        setStatus('success');
        return payload;
      } catch (reason) {
        const message = reason instanceof Error ? reason.message : 'Failed to load tenant.';

        if (mountedRef.current && requestId === requestRef.current) {
          setStatus('error');
          setError(message);
        }

        throw reason instanceof Error ? reason : new Error(message);
      }
    },
    [baseUrl],
  );

  useEffect(() => {
    if (options.lazy) {
      return;
    }

    fetchTenant(tenantIdRef.current).catch(() => undefined);
  }, [fetchTenant, options.lazy]);

  return {
    tenant,
    status,
    error,
    isLoading: status === 'loading',
    isError: status === 'error',
    refresh: () => fetchTenant(tenantIdRef.current),
    tenantId: tenant?.storeId ?? tenantIdRef.current,
  };
}

export interface UseCatalogOptions {
  tenantId?: string;
  baseUrl?: string;
  lazy?: boolean;
}

export interface CatalogSnapshot {
  categories: CatalogCategory[];
  products: CatalogProduct[];
}

export interface UseCatalogResult {
  data: CatalogSnapshot | null;
  status: AsyncStatus;
  error: string | null;
  isLoading: boolean;
  isError: boolean;
  refresh: () => Promise<CatalogSnapshot>;
  tenantId: string;
}

export function useCatalog(options: UseCatalogOptions = {}): UseCatalogResult {
  const requestedTenantId = options.tenantId ?? DEFAULT_TENANT_ID;
  const baseUrl = useMemo(() => options.baseUrl ?? resolveApiBaseUrl(), [options.baseUrl]);
  const [snapshot, setSnapshot] = useState<CatalogSnapshot | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const tenantIdRef = useRef(requestedTenantId);
  const mountedRef = useRef(true);
  const requestRef = useRef(0);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  useEffect(() => {
    tenantIdRef.current = requestedTenantId;
  }, [requestedTenantId]);

  const fetchCatalog = useCallback(
    async (targetTenantId: string = tenantIdRef.current) => {
      const requestId = ++requestRef.current;

      if (mountedRef.current) {
        setStatus('loading');
        setError(null);
      }

      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch(`${baseUrl}/tenants/${targetTenantId}/catalog/categories`, { cache: 'no-store' }),
          fetch(`${baseUrl}/tenants/${targetTenantId}/catalog/products`, { cache: 'no-store' }),
        ]);

        if (!categoriesResponse.ok || !productsResponse.ok) {
          if (!categoriesResponse.ok) {
            throw new Error(await readErrorMessage(categoriesResponse));
          }
          throw new Error(await readErrorMessage(productsResponse));
        }

        const [categories, products] = (await Promise.all([
          categoriesResponse.json(),
          productsResponse.json(),
        ])) as [CatalogCategory[], CatalogProduct[]];

        if (!mountedRef.current || requestId !== requestRef.current) {
          return { categories, products } satisfies CatalogSnapshot;
        }

        const payload = { categories, products } satisfies CatalogSnapshot;
        setSnapshot(payload);
        setStatus('success');
        return payload;
      } catch (reason) {
        const message =
          reason instanceof Error ? reason.message : 'Failed to load catalog dataset.';

        if (mountedRef.current && requestId === requestRef.current) {
          setStatus('error');
          setError(message);
        }

        throw reason instanceof Error ? reason : new Error(message);
      }
    },
    [baseUrl],
  );

  useEffect(() => {
    if (options.lazy) {
      return;
    }

    fetchCatalog(tenantIdRef.current).catch(() => undefined);
  }, [fetchCatalog, options.lazy]);

  return {
    data: snapshot,
    status,
    error,
    isLoading: status === 'loading',
    isError: status === 'error',
    refresh: () => fetchCatalog(tenantIdRef.current),
    tenantId: tenantIdRef.current,
  };
}
