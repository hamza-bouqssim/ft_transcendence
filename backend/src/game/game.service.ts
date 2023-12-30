/* eslint-disable prettier/prettier */
import { tr } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { error } from 'console';
import { promises } from 'dns';
import { stat } from 'fs/promises';
import { PrismaService } from 'prisma/prisma.service';



@Injectable()
export class GameService {
	constructor(private readonly prisma: PrismaService) {}

	async findUserById(id: string) {
		try{

			const user = await this.prisma.user.findUnique({
				where: {
					id: id,
				},
				select: {
					id: true,
					username: true,
					display_name: true,
					avatar_url: true,
				},
			});
			return user;
		}
		catch(error){
			// throw the error to the gateway
			return ;
		}
	}

	// level and rating
	level(win: number): number {
		const newLevel = Math.sqrt(win);
		return Math.round(newLevel * 100) / 100;
	}

	rating(playerRank: number, opponentRank: number, outcome: number) : number{
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
		userId: string,
		rating: number,
	) {
		try{

			const level = this.level(win);
			const state = await this.prisma.stateGame.update({
				where: {
					user_id: userId,
				},
				data: {
					win,
					lose,
					level: level,
					rating: rating,
				},
			});
			return state;
		}
		catch(error){

		}
	}

	async createStateGame(userId: string) {
		// const state = 
		try{

			await this.prisma.stateGame.create({
				data: {
					user: { connect: { id: userId } },
				},
			});
			await this.prisma.user.update({
				where:{
					id:userId
				},
				data:{
					first_time:false
				}
			})
		}catch(err){}
		}

	async deleteStateGame(userId: string) {
		try{

			const deleteState = await this.prisma.stateGame.delete({
				where: {
					user_id: userId,
				},
			});
			return deleteState;
		}
		catch(error){

		}
	}

	async getStateGame(userId: string) {
		try{

			const state = await this.prisma.stateGame.findUnique({
				where: {
					user_id: userId,
				},
			});
			return state;
		}
		catch(err){}
	}

	//history
	async setGameData(
		userIdOne: string,
		userIdTwo: string,
		resultOne: number,
		resultTwo: number,
		date: number,
	) {
		try{

			const duration = this.convertDuration(date);
			const state = await this.getStateGame(userIdOne);
			const state2 = await this.getStateGame(userIdTwo);
			const result1 = resultOne > resultTwo ? 1 : 0;
			const result2 = resultTwo > resultOne ? 1 : 0;
			
			const rating = this.rating(state.rating, state2.rating, result1);
			const rating2 = this.rating(state2.rating, state.rating, result2);
			await this.updateStateGame(
				state.win + result1,
				state.lose + result2,
				userIdOne,
				rating,
				);
				await this.updateStateGame(
					state2.win + result2,
					state2.lose + result1,
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
		}
		catch(err){}
	}

	async createMatchHistory(
		userIdOne: string,
		userIdTwo: string,
		resultOne: number,
		resultTwo: number,
		duration: string,
	) {
		try{

			const totalMatch = await this.totalMatch(userIdOne, userIdTwo) + 1;
			const match = await this.prisma.match_History.create({
				data: {
					playerOne: userIdOne,
					playerTwo: userIdTwo,
					resultOne: resultOne,
					resultTwo: resultTwo,
					totalMatch,
					duration,
				},
			});
			return match;
		}catch(error){
		}
	}

	// async deleteMatchHistory(playerId: string) {
	// 	await this.deleteStateGame(playerId);
	// 	const deleteMatch = await this.prisma.match_History.deleteMany({
	// 		where: {
	// 			OR: [{ playerOne: playerId }, { playerTwo: playerId }],
	// 		},
	// 	});
	// 	return deleteMatch;
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
//////////
	async history_matches(userId: string){
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
				totalMatch:true,
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

		const hours = Math.floor(date / 3600000);
		const minutes = Math.floor((date % 3600000) / 60000);
		const seconds = Math.floor(((date % 3600000) % 60000) / 1000);

		let duration: string;
		duration = (hours < 10 ? '0' + hours : hours) + ':';
		duration += (minutes < 10 ? '0' + minutes : minutes) + ':';
		duration += seconds < 10 ? '0' + seconds : seconds;
		return duration;
	}
}
