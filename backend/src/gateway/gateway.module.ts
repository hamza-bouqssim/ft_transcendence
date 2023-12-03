import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { WebSocketChatGateway } from './gateway';
import { RoomsService } from 'src/Rooms/rooms.service';
import { PrismaService } from 'prisma/prisma.service';
import { WebSocketAdapter } from './gateway.adapter';
import { PrismaModule } from 'prisma/prisma.module';
import { GateWaySessionManager } from './gateway.session';
import { Services } from 'src/utils/constants';
import { ConversationsService } from 'src/conversations/conversations.service';
import { UserService } from 'src/user/user.service';
const COOKIE_SECRET = 'my-secret';

@Module({
    imports: [],
    providers:[ WebSocketChatGateway,RoomsService,ConversationsService ,UserService, PrismaService, {
        provide : Services.GATEWAY_SESSION_MANAGER,
        useClass: GateWaySessionManager,
    }]
})
export class GatewayModule {}
