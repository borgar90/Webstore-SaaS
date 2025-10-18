import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CatalogController } from './catalog/catalog.controller';
import { CatalogService } from './catalog/catalog.service';
import { ModuleLoaderService } from './module-loader/module-loader.service';
import { TenantController } from './tenant/tenant.controller';
import { TenantService } from './tenant/tenant.service';

@Module({
  imports: [],
  controllers: [AppController, CatalogController, CartController, TenantController],
  providers: [AppService, ModuleLoaderService, TenantService, CatalogService, CartService],
})
export class AppModule {}
