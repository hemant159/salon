import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { SessionsModule } from '../sessions/sessions.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [SessionsModule, ServicesModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
