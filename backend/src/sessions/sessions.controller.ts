import {
  Controller, Post, Get, Patch, Body, Param, Query,
  UseGuards, Request, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Request() req: { user: { sub: string; role: string } },
    @Body() body: { gender: string; service_ids: string; description?: string; client_id?: string },
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    const serviceIds = JSON.parse(body.service_ids ?? '[]') as string[];
    const session = await this.sessionsService.create({
      barber_id: req.user.sub,
      gender: body.gender,
      service_ids: serviceIds,
      description: body.description,
      client_id: body.client_id,
    });

    if (photo) {
      const photoUrl = await this.sessionsService.uploadPhoto(session.id, photo);
      // Update session with photo URL
      const updated = await this.sessionsService.findById(session.id);
      return { ...updated, photo_url: photoUrl };
    }

    return session;
  }

  @Get()
  findAll(
    @Request() req: { user: { sub: string; role: string } },
    @Query('page') page = '1',
  ) {
    if (req.user.role === 'admin') {
      return this.sessionsService.findAll(parseInt(page));
    }
    return this.sessionsService.findByBarber(req.user.sub, parseInt(page));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findById(id);
  }

  @Patch(':id/select')
  select(
    @Param('id') id: string,
    @Body() body: { suggestion_id: string },
  ) {
    return this.sessionsService.selectSuggestion(id, body.suggestion_id);
  }
}
