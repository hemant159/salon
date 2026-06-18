import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  overview() { return this.analyticsService.getOverview(); }

  @Get('retention')
  retention(@Query('period') period: 'week' | 'month' = 'week') {
    return this.analyticsService.getRetention(period);
  }

  @Get('services')
  services() { return this.analyticsService.getServicePopularity(); }

  @Get('clients/top')
  topClients() { return this.analyticsService.getTopClients(); }
}
