import { Module } from '@nestjs/common';
import { ParticipentService } from './Participent.service';
import { ParticipentController } from './Participent.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [ParticipentService, PrismaService],
  controllers: [ParticipentController]
})
export class ParticipentModule {}
