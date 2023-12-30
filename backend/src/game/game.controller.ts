/* eslint-disable prettier/prettier */
import {
	Controller,
	Post,
	Get,
	Body,
	UseGuards,
	Res,
} from '@nestjs/common';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post('myhistory')
	@UseGuards(AuthGuard('jwt'))
	async getMyHistory(@Body() request: { userId: string }, @Res() res: any) {
		try {
			const history = await this.gameService.history_matches(request.userId);
			const modifiedHistory = await Promise.all(
				history.map(async (entry) => {
					if (entry.playerOne == request.userId) {
						return {
							
							playerOne: entry.playerone.avatar_url,
							playerTwo: entry.playertwo.avatar_url,
							resultOne: entry.resultOne,
							resultTwo: entry.resultTwo,
							date: entry.createdAt.toISOString().split('T')[0],
							duration: entry.duration,
							totalMatch: entry.totalMatch,
						};
					} else {
						return {
							playerOne: entry.playertwo.avatar_url,
							playerTwo: entry.playerone.avatar_url,
							resultOne: entry.resultTwo,
							resultTwo: entry.resultOne,
							date: entry.createdAt.toISOString().split('T')[0],
							duration: entry.duration,
							totalMatch: entry.totalMatch,
						};
					}
				}),
			);

			res.status(200).json(modifiedHistory);
		} catch (error) {
			return res.status(401).json(error.response);
		}
	}

	@Get('ranking')
	@UseGuards(AuthGuard('jwt'))
	async getAllRanking(@Res() res) {
		try {
			const rating = await this.gameService.getRanks();
			const modifiedRank = rating.map((entry, index) => ({
				rank: index + 1,
				rating: entry.rating,
				username: entry.user.username,
				picture: entry.user.avatar_url,
			}));
			return res.status(200).json(modifiedRank);
		} catch (error) {
			return  res.status(401).json(error.response)
		}
	}

	@Post('myresult')
	@UseGuards(AuthGuard('jwt'))
	async getMyState(@Body() request: { userId: string }, @Res() res) {
		try {
			const results = await this.gameService.getResult(request.userId);
			return res.status(200).json(results);
		} catch (error) {
			return res.status(401).json(error.response);
		}
	}
}
