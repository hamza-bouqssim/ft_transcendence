import { Controller, Post, Get, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get('myhistory')
	@UseGuards(AuthGuard('jwt'))
	async getMyHistory(@Req() req) {
	  try {
		const userId = req.user.id;
		const history = await this.gameService.history_matches(userId);
		const modifiedHistory = await Promise.all(
		history.map(async (entry) => {
			if (entry.playerOne == userId) {
				return {
					playerOne: entry.playerone.avatar_url,
					playerTwo: entry.playertwo.avatar_url,
					resultOne: entry.resultOne,
					resultTwo: entry.resultTwo,
					date: entry.createdAt.toISOString().split('T')[0],
					duration: entry.duration,
					totalMatch: await this.gameService.totalMatch(
						entry.playerOne,
						entry.playerTwo,
					),
				};
			} else {
				return {
					playerOne: entry.playertwo.avatar_url,
					playerTwo: entry.playerone.avatar_url,
					resultOne: entry.resultTwo,
					resultTwo: entry.resultOne,
					date: entry.createdAt.toISOString().split('T')[0],
					duration: entry.duration,
					totalMatch: await this.gameService.totalMatch(
						entry.playerOne,
						entry.playerTwo,
					),
				};
			}
		  })
		);
		return modifiedHistory;
	  } catch (error) {
		console.log(error);
		}
	}

	@Get('ranking')
	@UseGuards(AuthGuard('jwt'))
	async getAllRanking() {
		try {
			const rating = await this.gameService.getRanks();
			const modifiedRank = rating.map((entry, index) => ({
				rank:index + 1,
				rating: entry.rating,
				username: entry.user.username,
				picture: entry.user.avatar_url, // Rename 'avatar_url' to 'picture'
			}));
			return modifiedRank;
		} catch (error) {
			console.log(error);
		}
	}

	@Get('myresult')
	@UseGuards(AuthGuard('jwt'))
	async getMyState(@Req() req) {
		const userId = req.user.id;
		try{
			return await this.gameService.getResult(userId);
		}
		catch(error){
			console.log(error);
		}
	}

	// @Post('test')
	// async test(@Body() body : any){
	// 	try{
	// 		const state = await this.gameService.getStateGame(body.userId);
	// 		return await this.gameService.updateStateGame(state.win,state.lose,state.totalMatch,body.userId,body.rating)
	// 	}
	// 	catch(error){
	// 		console.log(error);
	// 		return {};
	// 	}
	// }
}
