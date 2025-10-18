import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModuleLoaderService } from './module-loader/module-loader.service';
import { TenantService } from './tenant/tenant.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ModuleLoaderService, TenantService],
})
export class AppModule {}
