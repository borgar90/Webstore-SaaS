import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get(':tenantId')
  getTenant(@Param('tenantId') tenantId: string) {
    return this.tenantService.getTenantConfig(tenantId);
  }

  @Get()
  resolveTenant(
    @Query('host') explicitHost?: string,
    @Headers('x-tenant-domain') headerHost?: string,
    @Headers('x-forwarded-host') forwardedHost?: string,
  ) {
    const host = explicitHost ?? headerHost ?? forwardedHost;
    return this.tenantService.resolveByHost(host);
  }
}
