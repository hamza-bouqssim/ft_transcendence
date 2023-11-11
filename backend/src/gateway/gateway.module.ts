/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessagingGateWay } from './gateway';
import { GateWaySessionManager } from './gateway.session';
import { Services } from 'src/utils/constants';

@Module({
    providers:[MessagingGateWay, {
        provide : Services.GATEWAY_SESSION_MANAGER,
        useClass: GateWaySessionManager,
    }]
})
export class GatewayModule {}
