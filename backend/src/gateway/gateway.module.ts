/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessagingGateWay } from './websocket.gateway';

@Module({
    providers:[MessagingGateWay]
})
export class GatewayModule {}
