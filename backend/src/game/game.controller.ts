import { Controller, Post, Get, Delete, Body, UseGuards , Res} from '@nestjs/common';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post('myhistory')
	@UseGuards(AuthGuard('jwt'))
	async getMyHistory(@Body() request: {userId: string}, @Res() res) {
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
				totalMatch: await this.gameService.totalMatch(entry.playerOne, entry.playerTwo),
			  };
			} else {
			  return {
				playerOne: entry.playertwo.avatar_url,
				playerTwo: entry.playerone.avatar_url,
				resultOne: entry.resultTwo,
				resultTwo: entry.resultOne,
				date: entry.createdAt.toISOString().split('T')[0],
				duration: entry.duration,
				totalMatch: await this.gameService.totalMatch(entry.playerOne, entry.playerTwo),
			  };
			}
		  })
		);
		
		res.status(200).json(modifiedHistory);
	  } catch (error) {
		console.log(error);
		return {};
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
				picture: entry.user.avatar_url,
			}));
			return modifiedRank;
		} catch (error) {
			console.log(error);
			return {}; 
		}
	}

	@Post('myresult')
	@UseGuards(AuthGuard('jwt'))
	async getMyState(@Body() request: {userId: string}, @Res() res) {
		try{
			const results = await this.gameService.getResult(request.userId);
			return res.status(200).json(results);
		}
		catch(error){
			console.log(error);
			return {};
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
