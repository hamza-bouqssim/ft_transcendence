import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaService } from 'prisma/prisma.service';
import { ParticipentService } from 'src/Participent/Participent.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, ParticipentService]
})
export class MessagesModule {}
