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
import { Server } from 'socket.io';
import { GameService } from '../game.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { PongGame } from '../classes/PongGame';
import { Vector } from 'matter-js';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserService } from 'src/user/user.service';

type User = {
	id: string;
	username: string;
	display_name: string;
	avatar_url: string;
};

export type KeyEventPayload = {
	state: string;
	key: string;
	id: string;
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
};

type Score = {
	yourScore: number;
	opponantScore: number;
};

type PaddleMove = {
	xPosition1: number;
	xPosition2: number;
};

type Emit = PaddleMove | Opponent | EndGame | Score | Vector | {};

export type GameQ = {
	indexMap: number;
	status: string;
	socket1: string | null;
	socket2: string | null;
	duration: Date;
	user1: User;
	user2: User;
	launch: boolean;
};

@WebSocketGateway({
	origin: ['http://10.12.2.12:3000'],
	credentials: true,
	namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	// private pong: PongGame;
	private mapPong: Map<string, PongGame> = new Map();
	private queueWaiting: {
		user: User;
		socket: string;
		indexMap: number;
	}[] = [];
	private queueGame: GameQ[] = [];

	constructor(
		private readonly gameservice: GameService,
		private readonly prisma: PrismaService,
		private readonly eventEmitter: EventEmitter2,
		private readonly userService: UserService,
	) {}

	async handleConnection(socket: AuthenticatedSocket) {
		const userId = socket.user.sub;
		const userdb = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!socket.user || !userdb) return;
		if (socket.user && userdb) {
			await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'ingame' },
			});
			this.eventEmitter.emit('Ingame.created', { userId });
		}
	}

	async startGame(invite: any) {
		if (!invite) return;
		const idGame = invite.user1.id;
		invite.state = 'panding';
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
	}
	async handleDisconnect(socket: AuthenticatedSocket) {
		socket.leave(`@${socket.user.sub}`);
		const userId = socket.user.sub;
		const userdb = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!socket.user || !userdb) return;
		if (socket.user) {
			await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'online' },
			});
			this.eventEmitter.emit('Ingameoffline.created', { userId });
		}
		const queue = this.getQueueWaiting(userId);
		if (queue && queue.socket === socket.id) {
			this.queueWaiting = this.queueWaiting.filter(
				(queue) => queue.user.id !== userId,
			);
		} else {
			const game = this.getQueueGame(userId);
			if (game) {
				const GameId = game.user1.id;
				if (!game.socket1 || socket.id === game.socket1) {
					if (!this.mapPong[GameId]) {
						// this.mapPong[GameId] = new PongGame(this, game);
						this.emitToUser2InGame(
							game.user2.id,
							{ display_name: game.user2.display_name },
							'redirectUser',
						);
						this.queueGame = this.queueGame.filter(
							(game) => game.user1.id != GameId,
						);
						this.queueWaiting = this.queueWaiting.filter(
							(queue) => queue.user.id !== GameId,
						);
						return;
					}
					this.mapPong[GameId].playerOneScore = 0;
					this.mapPong[GameId].playerTwoScore = 7;
					this.endGame(game);
				} else if (!game.socket2 || socket.id === game.socket2) {
					if (!this.mapPong[GameId]) {
						// this.mapPong[GameId] = new PongGame(this, game);
						this.emitToUser2InGame(
							game.user1.id,
							{ display_name: game.user1.display_name },
							'redirectUser',
						);
						this.queueGame = this.queueGame.filter(
							(game) => game.user1.id != GameId,
						);
						this.queueWaiting = this.queueWaiting.filter(
							(queue) => queue.user.id !== game.user2.id,
						);
						return;
					}
					this.mapPong[GameId].playerOneScore = 7;
					this.mapPong[GameId].playerTwoScore = 0;
					this.endGame(game);
				}
			}
		}
	}

	@OnEvent('game.invite')
	async handleInvitegame(data: any) {
		this.eventEmitter.emit('chat.newRequestToPlay', data);
	}

	@OnEvent('game.accept')
	async handleaccceptgame(data: any) {
		const user1 = {
			id: data.req_play.Sender.id,
			username: data.req_play.Sender.username,
			display_name: data.req_play.Sender.display_name,
			avatar_url: data.req_play.Sender.avatar_url,
		};
		const user2 = {
			id: data.req_play.recipient.id,
			username: data.req_play.recipient.username,
			display_name: data.req_play.recipient.display_name,
			avatar_url: data.req_play.recipient.avatar_url,
		};
		this.queueGame.push({
			indexMap: 0,
			socket1: null,
			socket2: null,
			duration: new Date(),
			status: 'invite',
			user2,
			user1,
			launch: false,
		});
		try{
			const userOne = await this.prisma.user.findUnique({where:{id:user1.id}})
			const userTwo = await this.prisma.user.findUnique({where:{id:user2.id}})
			if(!userOne || !userTwo || userOne.status !== 'online' || userTwo.status !== 'online')
			{
				this.queueGame = this.queueGame.filter((queue) => queue.user1.id !== userOne.id)
				this.eventEmitter.emit('requestRefusePlay.created', data);
				return ;
			}
		}
		catch(error){}
		this.eventEmitter.emit('chat.AcceptPLayNotification', data);
	}

	@SubscribeMessage('startGame')
	async handleJoinGame(client: AuthenticatedSocket, data: JoinPayload) {
		const game = this.getQueueGame(client.user.sub);
		const wait = this.getQueueWaiting(client.user.sub);
		if (
			typeof data.indexMap === 'string' ||
			+data.indexMap < 0 ||
			+data.indexMap > 2
		)
			return;
		const user = await this.gameservice.findUserById(client.user.sub);
		if (!user) return;
		if (wait || (game && game.status !== 'invite')) {
			client.emit('redirectUser', {
				display_name: user.display_name,
			});
			return;
		}
		if (game && game.status === 'invite') {
			if (game.user1.id === client.user.sub && game.socket1 === null) {
				client.join(`@${client.user.sub}`);
				// client.leave(`@${client.user.sub}`);
				game.socket1 = client.id;
				if (game.socket2 !== null) {
					this.startGame(game);
				}
			} else if (game.user2.id === client.user.sub && game.socket2 === null) {
				client.join(`@${client.user.sub}`);
				// client.leave(`@${client.user.sub}`);
				game.socket2 = client.id;
				if (game.socket1 !== null) {
					this.startGame(game);
				}
			}
			return;
		}
		if (Number(data.indexMap) > 2 || Number(data.indexMap) < 0) return;
		client.join(`@${client.user.sub}`);
		this.queueWaiting.push({
			indexMap: Number(data.indexMap),
			user: user,
			socket: client.id,
		});
		if (this.queueWaiting.length >= 2) await this.checkQueue();
	}

	// emit to user a message in an event---------------------------------------
	emitToGame(user1: string, user2: string, payload: Emit, event: string) {
		this.server.to(`@${user1}`).to(`@${user2}`).emit(event, payload);
	}

	emitToUser1InGame(userId: string, payload: Emit, event: string) {
		this.server.to(`@${userId}`).emit(event, payload);
		return 1;
	}

	emitToUser2InGame(userId: string, payload: Emit, event: string) {
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
			const userOne = map[0].user;
			const userTwo = map[1].user;
			this.queueWaiting = this.queueWaiting.filter(
				(queue) => queue.user.id !== userOne.id && queue.user.id !== userTwo.id,
			);
			this.queueGame.push({
				status: 'pending',
				socket1: map[0].socket,
				socket2: map[1].socket,
				duration: new Date(),
				indexMap: map[0].indexMap,
				user1: userOne,
				user2: userTwo,
				launch: false,
			});

			map = map.filter(
				(queue) => queue.user.id !== userOne.id && queue.user.id !== userTwo.id,
			);

			const game = this.getQueueGame(userOne.id);
			const idGame = userOne.id;
			this.emitToUser2InGame(
				userTwo.id,
				{ opponent: userOne, rotate: true, idGame },
				'knowOpponent',
			);
			this.emitToUser1InGame(
				userOne.id,
				{ opponent: userTwo, rotate: false, idGame },
				'knowOpponent',
			);
			if (!game) return;
			game.status = 'playing';
		}
		return;
	}
	// Queue---------------------------------------
	getQueueWaiting(userId: string) {
		return this.queueWaiting.find((queue) => queue.user.id === userId);
	}

	getQueueGame(userId: string) {
		return this.queueGame.find(
			(queue) => queue.user1.id === userId || queue.user2.id === userId,
		);
	}
	async endGame(game: GameQ) {
		const user1 = game.user1.id;
		const user2 = game.user2.id;
		const endDate = new Date();
		const duration = endDate.getTime() - game.duration.getTime();
		// Clear Game
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

		const score1 = this.mapPong[game.user1.id].playerOneScore;
		const score2 = this.mapPong[game.user1.id].playerTwoScore;
		// delete this.mapPong[game.user1.id];

		this.mapPong[game.user1.id].handleClearGame();
		delete this.mapPong[game.user1.id];
		this.queueGame = this.queueGame.filter((game) => game.user1.id != user1);

		await this.gameservice.setGameData(user1, user2, score1, score2, duration);
	}
	// End Queue---------------------------------------
	@SubscribeMessage('launchGameRequest')
	async handleLaunchGameRequest(
		@ConnectedSocket() socket: AuthenticatedSocket,
	) {
		const game = this.getQueueGame(socket.user.sub);
		if (!game) return;
		if (
			game &&
			!game.launch &&
			(game.socket1 === socket.id || game.socket2 === socket.id)
		) {
			game.launch = true;
			return;
		}
		game.duration = new Date();
		game.status = 'playing';
		this.mapPong[game.user1.id] = new PongGame(this, game);
	}

	@SubscribeMessage('keyevent')
	handleKeyDown(
		@MessageBody() data: KeyEventPayload,
		@ConnectedSocket() socket: AuthenticatedSocket,
	) {
		const game = this.getQueueGame(socket.user.sub);
		if (!game) return;
		const tmp = { id: socket.user.sub, ...data };
		this.mapPong[game.user1.id].handleKeyDown(tmp);
	}
}
