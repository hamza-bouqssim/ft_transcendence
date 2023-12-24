/* eslint-disable prettier/prettier */
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayDisconnect,
	OnGatewayConnection,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../game.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { PongGame } from '../classes/PongGame';
import { da, ne } from '@faker-js/faker';
import { type } from 'os';
import Matter, { Vector } from 'matter-js';
import {EventEmitter2,OnEvent} from  '@nestjs/event-emitter';
import { Console } from 'console';
import { UserService } from 'src/user/user.service';
import { filter } from 'rxjs';

type User = {
	id: string;
	display_name: string;
	avatar_url: string;
};

type InvitePayload = {
	opponentId: string;
};

export type KeyEventPayload = {
	state: string;
	key: string;
	display_name:string;
};

type JoinPayload = {
	indexMap: string;
};

type Opponent = {
	opponent: User;
	rotate: boolean;
	idGame: string;
};

type EndGame = {
	status: string;
}

type Score = {
	yourScore: number;
	opponantScore : number;
};

type PaddleMove = {
	xPosition1: number;
	xPosition2: number;
}

type Emit = PaddleMove | Opponent | EndGame | Score | Vector | {};

export type GameQ = {
	indexMap: number;
	status: string;
	socket1: AuthenticatedSocket;
	socket2: AuthenticatedSocket;
	duration: Date;
	user1: User;
	user2: User;
	launch: boolean;
};

@WebSocketGateway({
	origin: ['http://localhost:3000'],
	credentials: true,
	namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	// private pong: PongGame;
	private mapPong: Map<string, PongGame> = new Map();
	private queueWaiting: {
		socket: AuthenticatedSocket;
		indexMap: number;
	}[] = [];
	private queueGame: GameQ[] = [];
	private QueueInvite: GameQ[] = [];

	constructor(
		private readonly gameservice: GameService,
		private readonly prisma: PrismaService,
		private readonly eventEmitter: EventEmitter2,
		private readonly userService : UserService
	) {}

	async handleConnection(socket: AuthenticatedSocket) {
		console.log('connect1   ...');
		console.log('socket', socket.user.sub);
		const userId = socket.user.sub;
		if (socket.user) {
			await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'ingame' },
			});
			this.eventEmitter.emit('Ingame.created', { userId });
		}

	}


	async startGame(invite : any)
	{
		console.log("invite", invite)
			
			if(!invite)
			return ;
		this.QueueInvite = this.QueueInvite.filter(game => game.user1.id !== invite.user1.id);
		this.queueGame.push(invite);
			const idGame = invite.user1.id;
			this.emitToUser2InGame(
				invite.user2.id,
				{ opponent: invite.user1, rotate: true, idGame },
				'knowOpponent',
			);
			this.emitToUser1InGame(
				invite.user1.id,
				{ opponent: invite.user2, rotate: false, idGame },
				'knowOpponent',
			);
			if (!invite) return;
			console.log('startgame +++++++++++++++');
	
			invite.status = 'playing';
	}
	async handleDisconnect(socket: AuthenticatedSocket) {
		console.log('Connection closed1');
		socket.leave(`@${socket.user.sub}`);
		const userId = socket.user.sub;
		if (socket.user) {
			await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'online' },
			});
			this.eventEmitter.emit('Ingameoffline.created', { userId });

		}
		const queue = this.getQueueWaiting(userId);
		if (queue) {
			this.queueWaiting = this.queueWaiting.filter(
				(queue) => queue.socket.user.sub !== userId,
			);
		} else {
			const findGame = this.getQueueGame(userId);
			const findInvite = this.getQueueInvite(userId);
			if (findGame || findInvite) {
				const GameId = findGame ? findGame.user1.id : findInvite.user1.id;
				const game = findGame ? findGame : findInvite;
				if (!this.mapPong[GameId])
					this.mapPong[GameId] = new PongGame(this, game);
				if (GameId === userId && game.socket1 && socket.id === game.socket1.id) {
					console.log('user1 leave game');
					this.mapPong[GameId].playerOneScore = 0;
					this.mapPong[GameId].playerTwoScore = 7;
					this.endGame(game);
				} else if (
					game.socket2 && game.user2.id === userId && 
					socket.id === findGame.socket2.id
				) {
					console.log('user2 leave game');
					this.mapPong[GameId].playerOneScore = 7;
					this.mapPong[GameId].playerTwoScore = 0;
					this.endGame(game);
				}
			}
		}
	}

	@OnEvent('game.invite')
	async handleInvitegame(data: any) {
		const message = `${data.requestToPlay.Sender.display_name} send you request to play`;
		const type = "requestPLay";
		const requestId = data.requestToPlay.id;
		this.eventEmitter.emit("chat.newRequestToPlay",data);
		this.userService.createNotification(data.requestToPlay.Sender, data.requestToPlay.recipient, message, type, requestId);
	}


	@OnEvent('game.accept')
	async handleaccceptgame(data: any) {
		// console.log("herererererere");
		// console.log("game accept",data)
		// console.log(data.req_play.senderId,data.req_play.recipientId)
		this.eventEmitter.emit("chat.AcceptPLayNotification",data);

		// const opponent = await this.gameservice.findUserById(data.opponentId);
		// const user = await this.gameservice.findUserById(client.user.sub);
		// if (game || wait || (invite && invite.status !== 'pending')) {
		// 	this.eventEmitter.emit('requestRefusePlay.created', "dija  khona f game ");
		// 	return;
		// }
		// this.eventEmitter.emit('requestPlay.created', "accepti nl3ab m3ak");
		const user1 = {
			id :data.req_play.Sender.id,
			display_name: data.req_play.Sender.display_name,
			avatar_url: data.req_play.Sender.avatar_url
		};
		const user2 = {
			id :data.req_play.recipient.id,
			display_name: data.req_play.recipient.display_name,
			avatar_url: data.req_play.recipient.avatar_url
		};
		this.QueueInvite.push({
			indexMap: 0,
			socket1: null,
			socket2: null,
			duration: new Date(),
			status: 'invite',
			user2,
			user1,
			launch: false,
		});
		
		// console.log("nonnnnn", this.QueueInvite);
		// setTimeout(()=>{
		// 	const gameInvite = this.getQueueInvite(user.id);
		// 	if( gameInvite && gameInvite.socket2 === null)
		// 		this.QueueInvite = this.QueueInvite.filter((game)=>
		// 	game.user1.id !== user.id);
		// },10000000)
		
		// remove this notfication 
	}
	@SubscribeMessage('startGame')
	async handleJoinGame(client: AuthenticatedSocket, data: JoinPayload) {
		const game = this.getQueueGame(client.user.sub);
		const wait = this.getQueueWaiting(client.user.sub);
		const invite = this.getQueueInvite(client.user.sub);
		const user = await this.gameservice.findUserById(client.user.sub);
		console.log("test start game -----------------------------------------------------------------")
		if (game || wait || (invite && invite.status !== 'invite')) {
			client.emit('redirectUser', {
				display_name: user.display_name,
			});
			return;
		}
		if(invite)
		{
			if(invite.user1.id === client.user.sub && invite.socket1 === null)
			{
		client.join(`@${client.user.sub}`);

				// client.leave(`@${client.user.sub}`);
				invite.socket1 = client;
				if(invite.socket2 !== null){
					console.log("user1-------------------------------")
					this.startGame(invite)
					return ;
				}
			}
			else if (invite.user2.id === client.user.sub && invite.socket2 === null)
			{
		client.join(`@${client.user.sub}`);

				// client.leave(`@${client.user.sub}`);
				invite.socket2 = client;
				if(invite.socket1 !== null){
					console.log("user2------------------------------------")
					this.startGame(invite)
					return;
				}
			}
		}
		if (Number(data.indexMap) > 2 || Number(data.indexMap) < 0) return;
		client.join(`@${client.user.sub}`);
		this.queueWaiting.push({
			indexMap: Number(data.indexMap),
			socket: client,
		});

		if (this.queueWaiting.length >= 2) await this.checkQueue();
	}

	// emit to user a message in an event---------------------------------------
	emitToGame(user1: string, user2: string, payload :Emit , event: string) {
		this.server.to(`@${user1}`).emit(event, payload);
		this.server.to(`@${user2}`).emit(event, payload);

	}

	emitToUser1InGame(userId: string, payload :Emit, event: string) {
		this.server.to(`@${userId}`).emit(event, payload);
		return 1;
	}

	emitToUser2InGame(userId: string, payload :Emit, event: string) {
		this.server.to(`@${userId}`).emit(event, payload);
		return 2;
	}

	//get map that readu to play in it-------------------------
	mapReadyToPlay() {
		const map = this.queueWaiting.filter((queue) => queue.indexMap === 0);
		const map1 = this.queueWaiting.filter((queue) => queue.indexMap === 1);
		const map2 = this.queueWaiting.filter((queue) => queue.indexMap === 2);
		if (map.length >= 2) return map;
		if (map1.length >= 2) return map1;
		if (map2.length >= 2) return map2;
	}

	//try to lunch game------------------------------
	async checkQueue() {
		let map = this.mapReadyToPlay();
		if (!map) return;
		while (map.length >= 2) {
			const userIdOne = map[0].socket.user.sub;
			const userIdTwo = map[1].socket.user.sub;
			const user1 = await this.gameservice.findUserById(userIdOne);
			const user2 = await this.gameservice.findUserById(userIdTwo);
			this.queueWaiting = this.queueWaiting.filter(
				(queue) =>
					queue.socket.user.sub !== userIdOne &&
					queue.socket.user.sub !== userIdTwo,
			);
			this.queueGame.push({
				status: 'pending',
				socket1: map[0].socket,
				socket2: map[1].socket,
				duration: new Date(),
				indexMap: map[0].indexMap,
				user1: user1,
				user2: user2,
				launch: false,
			});

			map = map.filter(
				(queue) =>
					queue.socket.user.sub !== userIdOne &&
					queue.socket.user.sub !== userIdTwo,
			);

			const game = this.getQueueGame(userIdOne);
			const idGame = userIdOne;
			this.emitToUser2InGame(
				userIdTwo,
				{ opponent: user1, rotate: true, idGame },
				'knowOpponent',
			);
			this.emitToUser1InGame(
				userIdOne,
				{ opponent: user2, rotate: false, idGame },
				'knowOpponent',
			);
			if (!game) return;
			console.log('test startgame +++++++++++++++');

			game.status = 'playing';
		}
		return;
	}
	// Queue---------------------------------------
	getQueueWaiting(userId: string) {
		return this.queueWaiting.find((queue) => queue.socket.user.sub === userId);
	}

	getQueueGame(userId: string) {
		return this.queueGame.find(
			(queue) =>
				queue.user1.id === userId || queue.user2.id === userId,
		);
	}
	getQueueInvite(userId: string) {
		return this.QueueInvite.find(
			(queue) =>
				queue.user1.id === userId || queue.user2.id === userId,
		);
	}

	async endGame(game: GameQ) {
		if (this.mapPong[game.user1.id]) {
			const user1 = game.user1.id;
			const user2 = game.user2.id;
			const endDate = new Date();
			const duration = endDate.getTime() - game.duration.getTime();
			if (
				this.mapPong[game.user1.id].playerOneScore >
				this.mapPong[game.user1.id].playerTwoScore
			) {
				this.emitToUser1InGame(user1, { status: 'winner' }, 'gameIsFinished');
				this.emitToUser2InGame(user2, { status: 'loser' }, 'gameIsFinished');
			} else {
				this.emitToUser2InGame(user2, { status: 'winner' }, 'gameIsFinished');
				this.emitToUser1InGame(user1, { status: 'loser' }, 'gameIsFinished');
			}
			// Clear Game

			const score1 = this.mapPong[game.user1.id].playerOneScore;
			const score2 = this.mapPong[game.user1.id].playerTwoScore;
			// delete this.mapPong[game.user1.id];
			// if (!this.mapPong[game.user1.id]) console.log('test');
			console.log(
				this.mapPong[game.user1.id].playerOneScore,
				this.mapPong[game.user1.id].playerTwoScore,
			);
			this.mapPong[game.user1.id].handleClearGame();
			delete this.mapPong[game.user1.id];
			this.queueGame = this.queueGame.filter(
				(game) => game.user1.id != user1,
			);
			this.QueueInvite = this.QueueInvite.filter(
				(game) => game.user1.id !== user1,
			);
			await this.gameservice.createTwoMatchHistory(
				user1,
				user2,
				score1,
				score2,
				duration,
			);
		}
	}
	// End Queue---------------------------------------
	@SubscribeMessage('launchGameRequest')
	handleLaunchGameRequest(@ConnectedSocket() socket: AuthenticatedSocket) {
		const game = this.getQueueGame(socket.user.sub);
		const invite = this.getQueueInvite(socket.user.sub);
		if (!game || invite) return;
		if (
			game &&
			!game.launch &&
			(game.socket1.id === socket.id || game.socket2.id === socket.id)
		) {
			game.launch = true;
			return;
		}
		game.duration = new Date();
		this.mapPong[game.user1.id] = new PongGame(this, game);
	}

	@SubscribeMessage('keyevent')
	handleKeyDown(
		@MessageBody() data: KeyEventPayload,
		@ConnectedSocket() socket: AuthenticatedSocket,
	) {
		const game = this.getQueueGame(socket.user.sub);
		if (!game) return;

		this.mapPong[game.user1.id].handleKeyDown(data);
	}
}
