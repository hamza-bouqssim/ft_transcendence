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
import { Vector } from 'matter-js';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
	display_name: string;
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
	) {}

	// sleep = async (ms: number) =>
	// 	new Promise((resolve) => setTimeout(resolve, ms));

	async handleConnection(socket: AuthenticatedSocket) {
		console.log('connect1   ...');
		console.log('socket', socket.user.sub);
		const userId = socket.user.sub;
		if (socket.user) {
			const newStatus = await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'ingame' },
			});
			this.eventEmitter.emit('Ingame.created', { userId });
		}
	}

	async handleDisconnect(socket: AuthenticatedSocket) {
		console.log('Connection closed1');
		socket.leave(`@${socket.user.sub}`);
		const userId = socket.user.sub;
		if (socket.user) {
			const newStatus = await this.prisma.user.update({
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
				const GameId = findGame ? findGame.user1.id : findInvite.user2.id;
				const game = findGame ? findGame : findInvite;
				if (!this.mapPong[GameId])
					this.mapPong[GameId] = new PongGame(this, game);
				if (GameId === userId && socket.id === game.socket1.id) {
					console.log('user1 leave game');
					this.mapPong[GameId].playerOneScore = 0;
					this.mapPong[GameId].playerTwoScore = 7;
					this.endGame(game);
				} else if (
					game.socket2.user.sub === userId &&
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

	@SubscribeMessage('invite')
	async handleInvite(client: AuthenticatedSocket, data: InvitePayload) {
		const game = this.getQueueGame(client.user.sub);
		const wait = this.getQueueWaiting(client.user.sub);
		const invite = this.getQueueInvite(client.user.sub);
		const user = await this.gameservice.findUserById(client.user.sub);
		const opponent = await this.gameservice.findUserById(data.opponentId);
		// if player in game or wait or invite not pending ===> redirect
		if (game || wait || (invite && invite.status !== 'pending')) {
			client.emit('redirectUser', {
				display_name: user.display_name,
			});
			return;
		}
		client.join(`@${client.user.sub}`);
		if (!invite) {
			this.QueueInvite.push({
				indexMap: 0,
				socket1: client,
				socket2: null,
				duration: new Date(),
				status: 'pending',
				user1: user,
				user2: opponent,
				launch: false,
			});
		} else {
			invite.status = 'playing';
			invite.socket2 = client;
			invite.duration = new Date();
			this.mapPong[game.user1.id] = new PongGame(this, game);
		}
	}

	@SubscribeMessage('startGame')
	async handleJoinGame(client: AuthenticatedSocket, data: JoinPayload) {
		const game = this.getQueueGame(client.user.sub);
		const wait = this.getQueueWaiting(client.user.sub);
		const invite = this.getQueueInvite(client.user.sub);
		const user = await this.gameservice.findUserById(client.user.sub);

		if (game || wait || invite) {
			client.emit('redirectUser', {
				display_name: user.display_name,
			});
			return;
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
	emitToGame(user1: string, user2: string, payload: Emit, event: string) {
		this.server.to(`@${user1}`).emit(event, payload);
		this.server.to(`@${user2}`).emit(event, payload);
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
				queue.socket1.user.sub === userId || queue.socket2.user.sub === userId,
		);
	}
	getQueueInvite(userId: string) {
		return this.QueueInvite.find(
			(queue) =>
				queue.socket1.user.sub === userId || queue.socket2.user.sub === userId,
		);
	}

	async endGame(game: GameQ) {
		if (this.mapPong[game.user1.id]) {
			const user1 = game.socket1.user.sub;
			const user2 = game.socket2.user.sub;
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
				(game) => game.socket1.user.sub != user1,
			);
			this.QueueInvite = this.QueueInvite.filter(
				(game) => game.socket1.user.sub != user1,
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
