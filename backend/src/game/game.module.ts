import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './gateway/game.gateway';

@Module({
  providers: [GameGateway, GameService],
  controllers: [GameController],
})
export class GameModule {}
