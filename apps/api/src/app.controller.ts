import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return this.appService.getHealth();
  }
  
  @Get('tenants/:tenantId/modules')
  async modules(@Param('tenantId') tenantId: string) {
    return this.appService.getTenantModules(tenantId);
  }
}
