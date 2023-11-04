/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ParticipentService } from 'src/Participent/Participent.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService , PrismaService,  UserService, ParticipentService, JwtService]
})
export class ConversationsModule {}
