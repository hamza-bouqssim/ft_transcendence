import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Result } from '@prisma/client';
import { en } from '@faker-js/faker';

enum EventType {
	UNPROCESSED,
	FINAL,
}

@Injectable()
export class GameService {
	constructor(private readonly prisma: PrismaService) {}

	async findUserById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});
		return user;
	}

	// level and rating
	level(win: number): number {
		const currentLevel = win * (100 * 0.05) - win * 0.05;
		// const increas = (100 - currentLevel) * 0.05;
		// const updateLevel : number  = currentLevel + increas;
		return currentLevel;
	}


	rating(playerRank, opponentRank, outcome) {
		let k : number;
		if(playerRank > 2400)
			k = 16;
		else if(playerRank > 2100 && playerRank <= 2400)
			k = 24;
		else
			k = 32;
        const expectedScore = 1 / (1 + Math.pow(10, (opponentRank - playerRank) / 400));
        const newRank = playerRank + k * (outcome - expectedScore);
        return newRank;
    }

	//stateGame
	async updateStateGame(
		win: number,
		lose: number,
		totalMatch: number,
		userId: string,
		rating: number,
	) {
		const level = this.level(win);
		const state = await this.prisma.stateGame.update({
			where: {
				user_id: userId,
			},
			data: {
				win,
				lose,
				totalMatch,
				level: level,
				rating: rating,
			},
		});
		return state;
	}

	async createStateGame(userId: string) {
		const state = await this.prisma.stateGame.create({
			data: {
				user: { connect: { id: userId } },
			},
		});
		return state;
	}

	async deleteStateGame(userId: string) {
		const deleteState = await this.prisma.stateGame.delete({
			where: {
				user_id: userId,
			},
		});
		return deleteState;
	}

	async getStateGame(userId: string) {
		const state = await this.prisma.stateGame.findUnique({
			where: {
				user_id: userId,
			},
		});
		return state;
	}

	//history
	async createTwoMatchHistory(
		userIdOne: string,
		userIdTwo: string,
		resultOne: number,
		resultTwo: number,
		date: number,
	) {
		const duration = this.convertDuration(Date.now() - date);
		const state = await this.getStateGame(userIdOne);
		const state2 = await this.getStateGame(userIdTwo);
		const result1 = resultOne > resultTwo ? 1 : 0;
		const result2 = resultTwo > resultOne ? 1 : 0;

		const rating = this.rating(state.rating,state2.rating,result1);
		const rating2 = this.rating(state2.rating,state.rating,result2);
		console.log("rating",rating);
		console.log("rating",rating2);
		await this.updateStateGame(state.win + result1, state.lose + result2, state.totalMatch + 1, userIdOne,rating);
		await this.updateStateGame(state2.win + result2, state2.lose + result1, state2.totalMatch + 1, userIdTwo,rating2);
		await this.createMatchHistory(userIdOne, userIdTwo, resultOne, resultTwo ,duration);
	}

	async createMatchHistory(
		userIdOne: string,
		userIdTwo: string,
		resultOne: number,
		resultTwo: number,
		duration : string,
	) {
		const result = resultOne > resultTwo ? Result.WIN : Result.LOSS;
		try {
			console.log(
				`userIdOne: ${userIdOne}, userIdTwo:${userIdTwo},\n resultOne:${resultOne}, resultTwo:${resultTwo}, duration,${duration} result:${result}`,
			);
			const match = await this.prisma.match_History.create({
				data: {
					playerOne: userIdOne,
					playerTwo: userIdTwo,
					resultOne: resultOne,
					resultTwo: resultTwo,
					result: result,
					duration,
				},
			});
			return match;
		} catch (error) {
			console.log(error);
		}
		return {};
	}

	async deleteMatchHistory(playerId: string) {
		await this.deleteStateGame(playerId);
		const deleteMatch = await this.prisma.match_History.deleteMany({
			where: {
				OR: [{ playerOne: playerId }, { playerTwo: playerId }],
			},
		});
		return deleteMatch;
	}

	// async getMatchHistory(userId: string) {
	// 	const matchHistory = await this.prisma.match_History.findMany({
	// 		where: {
	// 			playerOne: userId,
	// 		},
	// 		orderBy: {
	// 			createdAt: 'desc',
	// 		},
	// 	});
	// 	return matchHistory;
	// }

	// endpoints of hamza
	getResult(userId: string) {
		const result = this.prisma.stateGame.findUnique({
			where: {
				user_id: userId,
			},
			select: {
				win: true,
				lose: true,
				level: true,
			},
		});
		return result;
	}

	async getRanks() {
		const rating = await this.prisma.stateGame.findMany({
			orderBy: {
				rating: 'desc',
			},
			select: {
				rating: true,
				user: {
					select: {
						username: true,
						avatar_url: true,
					},
				},
			},
		});
		return rating;
	}

	// async getRanking(userId: string) {
	// 	const rate = await this.prisma.stateGame.findUnique({
	// 		where: {
	// 			user_id: userId,
	// 		},
	// 		select: {
	// 			rating: true,
	// 			user: {
	// 				select: {
	// 					username: true,
	// 					avatar_url: true,
	// 				},
	// 			},
	// 		},
	// 	});
	// 	const modifiedRanking = {
	// 		rank: rate.rating,
	// 		username: rate.user.username,
	// 		picture: rate.user.avatar_url,
	// 	};
	// 	return modifiedRanking;
	// }

	async history_matches(userId: string) {
		const history = await this.prisma.match_History.findMany({
			where: {
				OR :[{ playerOne: userId }, { playerTwo: userId }],
			},
			orderBy: {
				createdAt: 'desc',
			},
			select: {
				playerone: {
					select: {
						avatar_url: true,
					},
				},
				playertwo: {
					select: {
						avatar_url: true,
					},
				},
				playerOne: true,
				playerTwo: true,
				resultOne: true,
				resultTwo: true,
				createdAt: true,
				duration: true,
			},
		});
		return history;
	}

	async totalMatch(user1: string,user2: string)
	{
		const totalMatch = await this.prisma.match_History.count({
			where: {
				AND :[{ playerOne: user1 }, { playerTwo: user2 } || { playerOne: user2 }, { playerTwo: user1 }]
			},
		});
		return totalMatch;
	}

	convertDuration(date: number) {
		const seconds = Math.floor(date / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		return `${hours}:${minutes % 60}:${seconds % 60}`

	}
}
