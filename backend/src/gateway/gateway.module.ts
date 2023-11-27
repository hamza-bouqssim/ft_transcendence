/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessagingGateWay } from './gateway';
import { GateWaySessionManager } from './gateway.session';
import { Services } from 'src/utils/constants';
import { RoomsService } from 'src/Rooms/rooms.service';
import { PrismaModule } from 'prisma/prisma.module';
import { GameGateway } from './gateway.game';
import { AuthService } from 'src/auth/auth.service';

@Module({
    imports: [PrismaModule],
    providers:[AuthService ,MessagingGateWay,RoomsService, {
        provide : Services.GATEWAY_SESSION_MANAGER,
        useClass: GateWaySessionManager,
    }, GameGateway]
})
export class GatewayModule {}
