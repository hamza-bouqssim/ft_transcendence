import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';
import { en, tr } from '@faker-js/faker';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get('myhistory')
	async getMyHistory(@Body('userId') userId: string) {
	  try {
		const history = await this.gameService.history_matches(userId);
		const modifiedHistory = await Promise.all(
		history.map(async (entry) => {
			if (entry.playerOne == userId) {
			  return {
				playerOne: entry.playerone.avatar_url,
				playerTwo: entry.playertwo.avatar_url,
				resultOne: entry.resultOne,
				resultTwo: entry.resultTwo,
				date: entry.createdAt.toISOString(),
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
		return modifiedHistory;
	  } catch (error) {
		console.log(error);
		return {};
		}
	}
	
	

	@Get('ranking')
	async getAllRanking() {
		try {
			const rating = await this.gameService.getRanks();
			const modifiedRank = rating.map((entry, index) => ({
				rank:entry.rating,
				username: entry.user.username,
				picture: entry.user.avatar_url, // Rename 'avatar_url' to 'picture'
			}));
			return modifiedRank;
		} catch (error) {
			console.log(error);
			return {};
		}
	}

	@Get('myresult')
	async getMyState(@Body('userId') userId: string) {
		try{
			return await this.gameService.getResult(userId);
		}
		catch(error){
			console.log(error);
			return {};
		}
	}
}
