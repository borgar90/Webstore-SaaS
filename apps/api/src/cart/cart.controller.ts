import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('tenants/:tenantId/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  createCart(@Param('tenantId') tenantId: string) {
    return this.cartService.createCart({ tenantId });
  }

  @Get(':cartId')
  getCart(@Param('tenantId') tenantId: string, @Param('cartId') cartId: string) {
    return this.cartService.getCart(tenantId, cartId);
  }

  @Post(':cartId/items')
  addItem(
    @Param('tenantId') tenantId: string,
    @Param('cartId') cartId: string,
    @Body() body: { productId: string; quantity?: number },
  ) {
    return this.cartService.addItem(tenantId, cartId, body);
  }

  @Patch(':cartId/items/:itemId')
  updateItemQuantity(
    @Param('tenantId') tenantId: string,
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateItemQuantity(tenantId, cartId, itemId, body);
  }

  @Delete(':cartId/items/:itemId')
  removeItem(
    @Param('tenantId') tenantId: string,
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(tenantId, cartId, itemId);
  }
}
