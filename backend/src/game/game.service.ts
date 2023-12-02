// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';

// enum EventType {
// 	UNPROCESSED,
// 	FINAL,
// }

// @Injectable()
// export class GameService {
// 	constructor(private readonly prisma: PrismaService) {}

// 	//part of queue
// 	async readyToPlay() {
// 		const queueCount = await this.prisma.queue.count();
// 		if (queueCount >= 2) {
// 			const room = await this.prisma.queue.findMany({
// 				orderBy: {
// 					createdAt: 'asc',
// 				},
// 				take: 2,
// 				include: {
// 					user: true,
// 				},
// 			});
// 			const [userIdOne, userIdTwo] = [room[0].user.id, room[1].user.id];
// 			await this.leaveQueue(userIdOne);
// 			await this.leaveQueue(userIdTwo);
// 			//Pong_match(userIdOne, userIdTwo)
// 			return await this.prisma.queue.count();
// 		}
// 		return queueCount;
// 	}

// 	async findUserById(id: string) {
// 		const user = await this.prisma.user.findUnique({
// 			where: {
// 				id: id,
// 			},
// 		});
// 		return user;
// 	}

// 	async joinQueue(userId: string) {
// 		const join = await this.prisma.queue.create({
// 			data: {
// 				user: { connect: { id: userId } },
// 			},
// 		});
// 		// this.readyToPlay();
// 		return join;
// 	}

// 	async leaveQueue(id: string) {
// 		const leave = await this.prisma.queue.delete({
// 			where: {
// 				userId: id,
// 			},
// 		});
// 		return leave;
// 	}

// 	async getQueue() {
// 		const rooms = await this.prisma.queue.findMany({
// 			include: {
// 				user: true,
// 			},
// 		});
// 		return rooms;
// 	}

// 	// part of pong_match

// 	async createPongMatch(userIdOne: string, userIdTwo: string) {
// 		const match = await this.prisma.pong_match.create({
// 			data: {
// 				playerOne: { connect: { id: userIdOne } },
// 				playerTwo: { connect: { id: userIdTwo } },
// 			},
// 		});
// 		return match;
// 	}

// 	async getPongMatch(id: string) {
// 		const match = await this.prisma.pong_match.findUnique({
// 			where: {
// 				id: id,
// 			},
// 		});
// 		return match;
// 	}

// 	async deletePongMatch(playerId: string) {
// 		const match = await this.prisma.pong_match.deleteMany({
// 			where: {
// 				OR: [{ player1_id: playerId }, { player2_id: playerId }],
// 			},
// 		});
// 		return match;
// 	}

// 	async endPongMatch(id: string) {
// 		const match = await this.prisma.pong_match.update({
// 			where: {
// 				id: id,
// 			},
// 			data: {
// 				updated_at: new Date(),
// 				// envent : FINAL,
// 			},
// 		});
// 		return match;
// 	}

// 	// part of match_history
// 	async createMatchHistory(
// 		userIdOne: string,
// 		userIdTwo: string,
// 		playerOne_score: number,
// 		playerTwo_score: number,
// 		matchId: string,
// 	) {
// 		const match = await this.prisma.match_History.create({
// 			data: {
// 				playerone: { connect: { id: userIdOne } },
// 				playertwo: { connect: { id: userIdTwo } },
// 				playerOne_score: playerOne_score,
// 				playerTwo_score: playerTwo_score,
// 				match: { connect: { id: matchId } },
// 			},
// 		});
// 		return match;
// 	}
// 	async deleteMatchHistory(playerId: string) {
// 		const deleteMatch = await this.prisma.match_History.deleteMany({
// 			where: {
// 				OR: [{ playerOne: playerId }, { playerTwo: playerId }],
// 			},
// 		});
// 		this.deletePongMatch(playerId);
// 		return deleteMatch;
// 	}

// 	async getMatchHistory(userId: string) {
// 		const matchHistory = await this.prisma.match_History.findMany({
// 			where: {
// 				OR: [{ playerOne: userId }, { playerTwo: userId }],
// 			},
// 		});
// 		return matchHistory;
// 	}

// 	// part of StateGame
// 	level(win: number): number {
// 		const currentLevel = win * (100 * 0.05) - win * 0.05;
// 		// const increas = (100 - currentLevel) * 0.05;
// 		// const updateLevel : number  = currentLevel + increas;
// 		return currentLevel;
// 	}

// 	async rank(level: number, userId: string) {
// 		const users = await this.prisma.stateGame.findMany({
// 			select: {
// 				level: true,
// 				user_id: true,
// 			},
// 		});

// 		// Sort users by level in descending order
// 		const sortedUsers = users.sort((a, b) => b.level - a.level);

// 		// Find the index of the user with the specified userId
// 		const userIndex = sortedUsers.findIndex((user) => user.user_id === userId);

// 		// Return the rank (1-based) or 0 if the user is not found
// 		return userIndex !== -1 ? userIndex + 1 : 0;
// 	}

// 	async updateStateGame(
// 		win: number,
// 		lose: number,
// 		numberOfMatch: number,
// 		userId: string,
// 	) {
// 		const level = this.level(win);
// 		const rank = await this.rank(level, userId);
// 		const state = await this.prisma.stateGame.update({
// 			where: {
// 				user_id: userId,
// 			},
// 			data: {
// 				win,
// 				lose,
// 				numberOfMatch,
// 				level: level,
// 				rank: rank,
// 				user: { connect: { id: userId } },
// 			},
// 		});
// 	}

// 	async createStateGame(userId: string) {
// 		const state = await this.prisma.stateGame.create({
// 			data: {
// 				win: 0,
// 				lose: 0,
// 				numberOfMatch: 0,
// 				level: 0,
// 				rank: 0,
// 				user: { connect: { id: userId } },
// 			},
// 		});
// 	}

// 	async deleteStateGame(userId: string) {
// 		const deleteState = await this.prisma.stateGame.delete({
// 			where: {
// 				user_id: userId,
// 			},
// 		});
// 		return deleteState;
// 	}

// 	async getStateGame(userId: string) {
// 		const state = await this.prisma.stateGame.findMany({
// 			where: {
// 				user_id: userId,
// 			},
// 		});
// 		return state;
// 	}
// 	// part of Achievement
// 	async getAchievement(userId: string) {
// 		const achievements = await this.prisma.achievement.findMany({
// 			where: {
// 				user_id: userId,
// 			},
// 		});
// 		return achievements;
// 	}

// 	async createAchievement(userId: string) {
// 		const achievement = await this.prisma.achievement.create({
// 			data: {
// 				user: { connect: { id: userId } },
// 				content: 'Welcome to Pong Game',
// 				type: 'Welcome',
// 				picture: '',
// 				win: 0,
// 				lose: 0,
// 				level: 0,
// 			},
// 		});
// 	}

// 	async deleteAchievements(userId: string) {
// 		const deleteAchievement = await this.prisma.achievement.deleteMany({
// 			where: {
// 				user_id: userId,
// 			},
// 		});
// 		return deleteAchievement;
// 	}

// 	// async updateAchievement(
// 	// 	win: number,
// 	// 	lose: number,
// 	// 	level: number,
// 	// 	userId: string,
// 	// ) {
// 	// 	const achievement = await this.prisma.achievement.update({
// 	// 		where: {
// 	// 			user_id: userId,
// 	// 		},
// 	// 		data: {
// 	// 			win,
// 	// 			lose,
// 	// 			level,
// 	// 			user: { connect: { id: userId } },
// 	// 		},
// 	// 	});
// 	// }
// }
