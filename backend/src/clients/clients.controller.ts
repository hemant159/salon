import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ClientsService } from './clients.service';

export class CreateClientDto {
  @IsString() name: string;
  @IsString() phone: string;
  @IsString() gender: string;
  @IsOptional() @IsNumber() age?: number;
  @IsOptional() @IsString() notes?: string;
}
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('lookup')
  lookup(@Query('phone') phone: string) {
    return this.clientsService.lookupByPhone(phone);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('search') search = '',
  ) {
    return this.clientsService.findAll(parseInt(page), search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }
}
