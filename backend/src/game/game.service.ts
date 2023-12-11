import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Result } from '@prisma/client';

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

	async rating(level: number, userId: string) {
		const users = await this.prisma.stateGame.findMany({
			select: {
				level: true,
				user_id: true,
			},
		});

		// Sort users by level in descending order
		const sortedUsers = users.sort((a, b) => b.level - a.level);

		// Find the index of the user with the specified userId
		const userIndex = sortedUsers.findIndex((user) => user.user_id === userId);

		// Return the rating (1-based) or 0 if the user is not found
		return userIndex !== -1 ? userIndex + 1 : 0;
	}

	//stateGame
	async updateStateGame(
		win: number,
		lose: number,
		numberOfMatch: number,
		userId: string,
	) {
		const level = this.level(win);
		const rating = await this.rating(level, userId);
		const state = await this.prisma.stateGame.update({
			where: {
				user_id: userId,
			},
			data: {
				win,
				lose,
				numberOfMatch,
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

	history
	async createMatchHistory(
		userIdOne: string,
		userIdTwo: string,
		resultOne: number,
		resultTwo: number,
		duration: number,
	) {
		const state = await this.getStateGame(userIdOne);
		const { win, lose, numberOfMatch } = state;
		if (resultOne > resultTwo)
			await this.updateStateGame(win + 1, lose, numberOfMatch + 1, userIdOne);
		else
			await this.updateStateGame(win, lose + 1, numberOfMatch + 1, userIdOne);
		console.log('result');

		const result = resultOne > resultTwo ? Result.WIN : Result.LOSS;
		try {
			// model Match_History {
			// 	id            String   @id @default(uuid())
			// 	playerOne     String
			// 	playerTwo     String
			// 	resultOne     Int
			// 	resultTwo     Int
			// 	result        Result   @default(UNPROCESSED)
			// 	createdAt     DateTime @default(now())
			// 	numberOfMatch Int      @default(0)
			// 	duration      Int
			// 	playerone     User     @relation("playerOne", fields: [playerOne], references: [id])
			// 	playertwo     User     @relation("playerTow", fields: [playerTwo], references: [id])
			//   }

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
					duration: duration,
					numberOfMatch: 1,
					// ... other fields ...
				},
			});

			console.log(match);
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

	async getMatchHistory(userId: string) {
		const matchHistory = await this.prisma.match_History.findMany({
			where: {
				playerOne: userId,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
		return matchHistory;
	}

	// endpoints of hamza
	getResult(userId: string) {
		const result = this.prisma.stateGame.findUnique({
			where: {
				user_id: userId,
			},
			select: {
				win: true,
				lose: true,
				rating: true,
			},
		});
		return result;
	}

	async getRanks() {
		const rating = await this.prisma.stateGame.findMany({
			orderBy: {
				rating: 'asc',
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
		const modifiedRank = rating.map((entry) => ({
			rank: entry.rating,
			// exclude the 'user' property from the entry
			username: entry.user.username,
			picture: entry.user.avatar_url, // Rename 'avatar_url' to 'picture'
		}));
		return modifiedRank;
	}

	async getRanking(userId: string) {
		const rate = await this.prisma.stateGame.findUnique({
			where: {
				user_id: userId,
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
		const modifiedRanking = {
			rank: rate.rating,
			username: rate.user.username,
			picture: rate.user.avatar_url,
		};
		return modifiedRanking;
	}

	async history_matches(userId: string) {
		const history = await this.prisma.match_History.findMany({
			where: {
				playerOne: userId,
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
				resultOne: true,
				resultTwo: true,
				createdAt: true,
				duration: true,
				numberOfMatch: true,
			},
		});
		const modifiedHistory = history.map((entry) => ({
			playerOne: entry.playerone.avatar_url,
			playerTwo: entry.playertwo.avatar_url,
			resultOne: entry.resultOne,
			resultTwo: entry.resultTwo,
			date: entry.createdAt.toISOString().split('T')[0],
			// duration: this.convertDuration(entry.duration),
			// numberOfMatch:entry.numberOfMatch,
		}));
		return modifiedHistory;
	}

	convertDuration(date: number) {
		const seconds = date % 60;
		const minutes = date / 60;
		return `${minutes}m ${seconds}s`;
	}
}
