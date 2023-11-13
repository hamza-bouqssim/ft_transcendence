import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './gateway/game.gateway';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [GameGateway, GameService,PrismaService],
  controllers: [GameController],
})
export class GameModule {}
