/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { RoomsModule } from './Rooms/rooms.module';
import { ConversationsModule } from './conversations/conversations.module';
import { GatewayModule } from './gateway/gateway.module';;
import { UserModule } from './user/user.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		AuthModule,
    PrismaModule,
		RoomsModule,
    ConversationsModule,
    GatewayModule,
		UserModule,
    FriendRequestModule,
		// GameModule,
		EventEmitterModule.forRoot(), ConfigModule.forRoot({ isGlobal : true})
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
