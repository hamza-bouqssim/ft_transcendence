import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ParticipentService } from 'src/Participent/Participent.service';
// import { Services } from 'src/utils/constants';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService , PrismaService,  UserService, ParticipentService]
})
export class ConversationsModule {}
