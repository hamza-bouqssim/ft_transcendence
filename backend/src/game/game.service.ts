import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GameService {
	constructor(private readonly prisma: PrismaService) {}

	async findUserById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			// select: {
			// 	id: true,
			// 	username: true,
			// 	avatar_url: true,
			// },
		});
		return user;
	}

	// level and rating
	level(win: number): number {
		const newLevel = Math.sqrt(win);
		return Math.round(newLevel * 100) / 100;
	}

	rating(playerRank: number, opponentRank: number, outcome: number) {
		let k: number;
		if (playerRank > 2400) k = 16;
		else if (playerRank > 2100 && playerRank <= 2400) k = 24;
		else k = 32;
		const expectedScore =
			1 / (1 + Math.pow(10, (opponentRank - playerRank) / 400));
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
	async createStateGame1(userIdOne: string, userIdTwo: string) {}

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
		try {
			let state: any;
			let state2: any;
			const endDate = new Date();
			const duration = this.convertDuration(date);
			state = await this.getStateGame(userIdOne);
			state2 = await this.getStateGame(userIdTwo);
			if (!state) state = await this.createStateGame(userIdOne);
			if (!state2) state2 = await this.createStateGame(userIdTwo);
			const result1 = resultOne > resultTwo ? 1 : 0;
			const result2 = resultTwo > resultOne ? 1 : 0;

			const rating = this.rating(state.rating, state2.rating, result1);
			const rating2 = this.rating(state2.rating, state.rating, result2);
			await this.updateStateGame(
				state.win + result1,
				state.lose + result2,
				state.totalMatch + 1,
				userIdOne,
				rating,
			);
			await this.updateStateGame(
				state2.win + result2,
				state2.lose + result1,
				state2.totalMatch + 1,
				userIdTwo,
				rating2,
			);
			const history = await this.createMatchHistory(
				userIdOne,
				userIdTwo,
				resultOne,
				resultTwo,
				duration,
			);
			return history;
		} catch (error) {
			console.log(error);
		}
	}

	async createMatchHistory(
		userIdOne: string,
		userIdTwo: string,
		resultOne: number,
		resultTwo: number,
		duration: string,
	) {
		const match = await this.prisma.match_History.create({
			data: {
				playerOne: userIdOne,
				playerTwo: userIdTwo,
				resultOne: resultOne,
				resultTwo: resultTwo,
				duration,
			},
		});
		return match;
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
	async getResult(userId: string) {
		const result = await this.prisma.stateGame.findUnique({
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
				OR: [{ playerOne: userId }, { playerTwo: userId }],
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

	async totalMatch(user1: string, user2: string) {
		const totalMatch = await this.prisma.match_History.count({
			where: {
				OR: [
					{ AND: [{ playerOne: user1 }, { playerTwo: user2 }] },
					{ AND: [{ playerOne: user2 }, { playerTwo: user1 }] },
				],
			},
		});
		return totalMatch;
	}

	convertDuration(date: number): string {
		console.log('date', date);

		const hours = Math.floor(date / 3600000);
		const minutes = Math.floor((date % 3600000) / 60000);
		const seconds = Math.floor(((date % 3600000) % 60000) / 1000);

		let duration;
		duration = (hours < 10 ? '0' + hours : hours) + ':';
		duration += (minutes < 10 ? '0' + minutes : minutes) + ':';
		duration += seconds < 10 ? '0' + seconds : seconds;
		return duration;
	}
}
