/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConversationsModule } from './conversations/conversations.module';
import { ParticipentModule } from './Participent/Participent.module';
import { MessagesModule } from './messages/messages.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { GatewayModule } from './gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RoomsModule } from './Rooms/rooms.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    PrismaClient,
    AuthModule, 
    JwtModule.register({
      secret: 'my-secret'
    }),
    RoomsModule,
    PassportModule.register({session: true}), UserModule, ConversationsModule, ParticipentModule, MessagesModule, FriendRequestModule, GatewayModule, GameModule ,EventEmitterModule.forRoot()],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService],
  
})
export class AppModule {}
