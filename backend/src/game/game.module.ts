import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
// import { GameGateway } from './gateway/game.gateway';
import { PrismaService } from 'prisma/prisma.service';
import { AuthUser } from 'src/utils/decorator';
import { UserService } from 'src/user/user.service';
import { Services } from 'src/utils/constants';
import { GateWaySessionManager } from 'src/gateway/gateway.session';


@Module({
	providers: [ GameService, PrismaService, UserService],
	controllers: [GameController, ],
})
export class GameModule {}
