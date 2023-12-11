import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}
}
