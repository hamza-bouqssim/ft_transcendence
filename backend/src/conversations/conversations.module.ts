/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports:[],
  controllers: [ConversationsController],
  providers: [ConversationsService,PrismaService,UserService ,]
})
export class ConversationsModule {}
