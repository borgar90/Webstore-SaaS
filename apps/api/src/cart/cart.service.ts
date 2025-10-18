import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CatalogService, type CatalogProduct } from '../catalog/catalog.service';
import { TenantService } from '../tenant/tenant.service';

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

interface CreateCartDto {
  tenantId: string;
}

interface AddItemDto {
  productId: string;
  quantity?: number;
}

interface UpdateItemQuantityDto {
  quantity: number;
}

@Injectable()
export class CartService {
  private readonly carts = new Map<string, Map<string, Cart>>();

  constructor(
    private readonly tenantService: TenantService,
    private readonly catalogService: CatalogService,
  ) {}

  async createCart(dto: CreateCartDto): Promise<Cart> {
    const { tenantId } = dto;
    await this.ensureTenant(tenantId);

    const now = new Date().toISOString();
    const cart: Cart = {
      id: randomUUID(),
      tenantId,
      items: [],
      currency: 'NOK',
      subtotal: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.carts.get(tenantId)!.set(cart.id, cart);

    return this.cloneCart(cart);
  }

  async getCart(tenantId: string, cartId: string): Promise<Cart> {
    const cart = await this.findCart(tenantId, cartId);
    return this.cloneCart(cart);
  }

  async addItem(tenantId: string, cartId: string, dto: AddItemDto): Promise<Cart> {
    if (!dto.productId) {
      throw new BadRequestException('productId is required');
    }

    const quantity = dto.quantity ?? 1;
    if (quantity <= 0) {
      throw new BadRequestException('quantity must be a positive integer');
    }

    const cart = await this.findCart(tenantId, cartId);
    const product = await this.findProduct(tenantId, dto.productId);

    this.assertCurrencyCompatibility(cart, product);

    const existing = cart.items.find((item) => item.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        id: randomUUID(),
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        quantity,
        imageLabel: product.imageLabel,
        badge: product.badge,
      });
    }

    this.recalculateCart(cart);
    return this.cloneCart(cart);
  }

  async updateItemQuantity(
    tenantId: string,
    cartId: string,
    itemId: string,
    dto: UpdateItemQuantityDto,
  ): Promise<Cart> {
    if (dto.quantity == null) {
      throw new BadRequestException('quantity is required');
    }

    if (dto.quantity <= 0) {
      throw new BadRequestException('quantity must be greater than zero');
    }

    const cart = await this.findCart(tenantId, cartId);
    const item = cart.items.find((entry) => entry.id === itemId);

    if (!item) {
      throw new NotFoundException(`Item '${itemId}' not found in cart '${cartId}'.`);
    }

    item.quantity = dto.quantity;
    this.recalculateCart(cart);

    return this.cloneCart(cart);
  }

  async removeItem(tenantId: string, cartId: string, itemId: string): Promise<Cart> {
    const cart = await this.findCart(tenantId, cartId);
    const index = cart.items.findIndex((entry) => entry.id === itemId);

    if (index === -1) {
      throw new NotFoundException(`Item '${itemId}' not found in cart '${cartId}'.`);
    }

    cart.items.splice(index, 1);
    this.recalculateCart(cart);

    return this.cloneCart(cart);
  }

  private async ensureTenant(tenantId: string) {
    await this.tenantService.getTenantConfig(tenantId);
    if (!this.carts.has(tenantId)) {
      this.carts.set(tenantId, new Map());
    }
  }

  private async findCart(tenantId: string, cartId: string) {
    await this.ensureTenant(tenantId);
    const cart = this.carts.get(tenantId)!.get(cartId);

    if (!cart) {
      throw new NotFoundException(`Cart '${cartId}' was not found for tenant '${tenantId}'.`);
    }

    return cart;
  }

  private async findProduct(tenantId: string, productId: string): Promise<CatalogProduct> {
    const products = await this.catalogService.listProducts(tenantId);
    const product = products.find((entry) => entry.id === productId);

    if (!product) {
      throw new NotFoundException(`Product '${productId}' not found for tenant '${tenantId}'.`);
    }

    return product;
  }

  private recalculateCart(cart: Cart) {
    cart.subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    cart.updatedAt = new Date().toISOString();

    if (cart.items.length === 0) {
      cart.currency = 'NOK';
      return;
    }

    cart.currency = cart.items[0].currency;
  }

  private cloneCart(cart: Cart): Cart {
    return {
      ...cart,
      items: cart.items.map((item) => ({ ...item })),
    };
  }

  private assertCurrencyCompatibility(cart: Cart, product: CatalogProduct) {
    if (cart.items.length === 0) {
      return;
    }

    const hasDifferentCurrency = cart.currency && cart.currency !== product.currency;
    if (hasDifferentCurrency) {
      throw new ConflictException(
        `Product currency '${product.currency}' does not match cart currency '${cart.currency}'.`,
      );
    }
  }
}
