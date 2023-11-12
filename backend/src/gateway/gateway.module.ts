/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessagingGateWay } from './websocket.gateway';
import { RoomsService } from 'src/Rooms/rooms.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers:[MessagingGateWay,RoomsService]
})
export class GatewayModule {}
