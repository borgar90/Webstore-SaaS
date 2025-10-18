import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('tenants/:tenantId/catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  listCategories(@Param('tenantId') tenantId: string) {
    return this.catalogService.listCategories(tenantId);
  }

  @Post('categories')
  createCategory(
    @Param('tenantId') tenantId: string,
    @Body() body: { name: string; description?: string },
  ) {
    return this.catalogService.addCategory(tenantId, body);
  }

  @Get('products')
  listProducts(@Param('tenantId') tenantId: string) {
    return this.catalogService.listProducts(tenantId);
  }

  @Post('products')
  createProduct(
    @Param('tenantId') tenantId: string,
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      currency: string;
      categoryId: string;
      imageLabel: string;
      badge?: string;
      rating?: number;
    },
  ) {
    return this.catalogService.addProduct(tenantId, body);
  }
}
