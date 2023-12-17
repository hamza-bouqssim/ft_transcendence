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
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';
import { GameModule } from './game/game.module';


@Module({
	imports: [
		EventEmitterModule.forRoot(),
		AuthModule,
    PrismaModule,
		RoomsModule,
    ConversationsModule,
    GatewayModule,
		UserModule,
    FriendRequestModule,
	TwoFactorAuthenticationModule,
		GameModule,
		EventEmitterModule.forRoot()
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
