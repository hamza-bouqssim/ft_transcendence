/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { RoomsService } from 'src/Rooms/rooms.service';

@Module({
  imports:[],
  controllers: [ConversationsController],
  providers: [ConversationsService,PrismaService,UserService , RoomsService]
})
export class ConversationsModule {}
