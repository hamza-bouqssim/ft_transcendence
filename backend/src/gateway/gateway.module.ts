/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessagingGateWay } from './gateway';
import { GateWaySessionManager } from './gateway.session';
import { Services } from 'src/utils/constants';
import { RoomsService } from 'src/Rooms/rooms.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers:[MessagingGateWay, MessagingGateWay,RoomsService, {
        provide : Services.GATEWAY_SESSION_MANAGER,
        useClass: GateWaySessionManager,
    }]
})
export class GatewayModule {}
