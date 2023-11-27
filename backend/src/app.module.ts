/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { RoomsModule } from './Rooms/rooms.module';


@Module({
	imports: [
		AuthModule,
		PrismaModule,
		RoomsModule,
		// UserModule,
		// ConversationsModule,
		// ParticipentModule,
		// MessagesModule,
		// FriendRequestModule,
		// GameModule,
		// GatewayModule,
		// EventEmitterModule.forRoot(),
		// GameModule,
		// RoomsModule
	],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
