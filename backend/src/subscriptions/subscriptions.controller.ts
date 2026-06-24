import { Controller, Get, Put, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SuperAdminGuard } from '../auth/super-admin.guard';

@Controller('admin/subscriptions')
@UseGuards(SuperAdminGuard) // Protect all routes in this controller
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  async findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Post()
  async create(@Body() createData: any) {
    return this.subscriptionsService.create(createData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.subscriptionsService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }

  // Utility endpoint to seed initial plans
  @Post('seed')
  async seedPlans() {
    return this.subscriptionsService.seedPlans();
  }
}
