export interface CatalogCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  imageLabel: string;
  badge?: string;
  rating?: number;
  createdAt: string;
}
