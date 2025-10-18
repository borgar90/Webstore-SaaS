import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { CatalogCategory, CatalogProduct } from '@bfs/utils';
import { randomUUID } from 'crypto';
import { TenantService } from '../tenant/tenant.service';

interface CreateCategoryDto {
  name: string;
  description?: string;
}

interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  imageLabel: string;
  badge?: string;
  rating?: number;
}

const DEFAULT_CATEGORIES: CatalogCategory[] = [
  {
    id: 'bath-and-body',
    name: 'Bath & Body',
    description: 'Hand-crafted soaps and skin treatments.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wellness',
    name: 'Wellness',
    description: 'Mindful scents and routines for calm living.',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_PRODUCTS: CatalogProduct[] = [
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
];

@Injectable()
export class CatalogService {
  private readonly categories = new Map<string, CatalogCategory[]>();
  private readonly products = new Map<string, CatalogProduct[]>();

  constructor(private readonly tenantService: TenantService) {}

  async listCategories(tenantId: string) {
    await this.ensureTenantSeeded(tenantId);
    return this.categories.get(tenantId)!;
  }

  async listProducts(tenantId: string) {
    await this.ensureTenantSeeded(tenantId);
    return this.products.get(tenantId)!;
  }

  async addCategory(tenantId: string, dto: CreateCategoryDto) {
    await this.ensureTenantSeeded(tenantId);
    const tenantCategories = this.categories.get(tenantId)!;

    if (tenantCategories.some((category) => category.name.toLowerCase() === dto.name.toLowerCase())) {
      throw new ConflictException(`Category '${dto.name}' already exists for tenant '${tenantId}'.`);
    }

    const category: CatalogCategory = {
      id: dto.name.trim().toLowerCase().replace(/\s+/g, '-'),
      name: dto.name,
      description: dto.description,
      createdAt: new Date().toISOString(),
    };

    tenantCategories.push(category);
    this.categories.set(tenantId, tenantCategories);

    return category;
  }

  async addProduct(tenantId: string, dto: CreateProductDto) {
    await this.ensureTenantSeeded(tenantId);
    const tenantProducts = this.products.get(tenantId)!;
    const tenantCategories = this.categories.get(tenantId)!;

    const category = tenantCategories.find((item) => item.id === dto.categoryId);
    if (!category) {
      throw new NotFoundException(
        `Category '${dto.categoryId}' is not configured for tenant '${tenantId}'.`
      );
    }

    const product: CatalogProduct = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      price: dto.price,
      currency: dto.currency,
      categoryId: dto.categoryId,
      imageLabel: dto.imageLabel,
      badge: dto.badge,
      rating: dto.rating ?? 4.5,
      createdAt: new Date().toISOString(),
    };

    tenantProducts.push(product);
    this.products.set(tenantId, tenantProducts);

    return product;
  }

  private async ensureTenantSeeded(tenantId: string) {
    await this.tenantService.getTenantConfig(tenantId);

    if (!this.categories.has(tenantId)) {
      this.categories.set(tenantId, DEFAULT_CATEGORIES.map((category) => ({ ...category })));
    }

    if (!this.products.has(tenantId)) {
      this.products.set(tenantId, DEFAULT_PRODUCTS.map((product) => ({ ...product })));
    }
  }
}
