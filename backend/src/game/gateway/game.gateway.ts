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
import { Bodies, Composite, Engine, Runner, Body, World } from 'matter-js';
import { GameService } from '../game.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenticatedSocket } from 'src/utils/interfaces';

const engine: Engine = Engine.create({
	gravity: {
		x: 0,
		y: 0,
	},
});

const runner: Runner = Runner.create();

type GameQ = {
	indexMap: number;
	user1: string;
	user2: string;
	status: string;
	socket1: string[];
	socket2: string[];
	duration: number;
};

@WebSocketGateway({
	origin: ['http://localhost:3000'],
	credentials: true,
	namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	// export class GameGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server;

	private ball: Body;
	private topPaddle: Body;
	private bottomPaddle: Body;
	private rightRect: Body;
	private leftRect: Body;
	private centerCirle: Body;
	private separator: Body;
	private topLeftObstacle: Body;
	private topRightObstacle: Body;
	private bottomLeftObstacle: Body;
	private bottomRightObstacle: Body;
	private verticalObstacle1: Body;
	private verticalObstacle2: Body;
	private verticalObstacle3: Body;
	private verticalObstacle4: Body;
	private defaultCanvasSizes: {
		width: number;
		height: number;
	} = {
		width: 560,
		height: 836,
	};
	private currentBallVelocity: {
		x: number;
		y: number;
	} = {
		x: 0,
		y: 0,
	};
	private paddleSizes: {
		width: number;
		height: number;
	} = {
		width: 170,
		height: 15,
	};
	private ballSpeed: any = {
		x: 2.5,
		y: 2.5,
	};
	private lastDirection: string = 'top';
	private movesUser1: {
		movingRight: boolean;
		movingLeft: boolean;
	} = {
		movingRight: false,
		movingLeft: false,
	};
	private movesUser2: {
		movingRight: boolean;
		movingLeft: boolean;
	} = {
		movingRight: false,
		movingLeft: false,
	};
	private posTopPaddleX = this.defaultCanvasSizes.width / 2;
	private posBottomPaddleX = this.defaultCanvasSizes.width / 2;
	private playerOneScore: number = 0;
	private playerTwoScore: number = 0;
	private updateBallPosition: NodeJS.Timer;
	private movePaddleInterval: NodeJS.Timer;
	private mapIndex: number;
	private userId: any;
	private user1: any;
	private user2: any;
	private game: GameQ;
	private queueWaiting: {
		userId: string;
		sockets: string[];
		indexMap: number;
	}[] = [];
	private queueInGame: GameQ[] = [];

	constructor(
		private readonly gameservice: GameService,
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
	) {}
	sleep = async (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	async handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
		console.log('connect1   ...');
		console.log('socket', socket.user.sub);
		socket.join(`@${socket.user.sub}`);
		if (socket.user) {
			const newStatus = await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'ingame' },
			});
		}
		this.userId = socket.user.sub;
		this.pushSocketToQueue(this.userId, socket.id, 0);
		if (this.queueWaiting.length >= 2) await this.checkQueue();
		// if (this.queueInGame.length > 0) {
		// 	const findGame = this.getInGameQueue(this.userId);
		// 	if (findGame) {
		// 		if (findGame.user1 === this.userId) {
		// 			console.log('pushSocketToQueue1', this.queueInGame);
		// 			findGame.socket1.push(socket.id);
		// 		} else {
		// 			console.log('pushSocketToQueue2', this.queueInGame);
		// 			findGame.socket2.push(socket.id);
		// 		}
		// 	}
		// } else {
		// 	const findQueue = this.getStratQueue(this.userId);
		// 	if (findQueue) this.getStratQueue(this.userId).sockets.push(socket.id);
		// }
		// console.log('waitting c', this.queueWaiting);
		// console.log('ingame c', this.queueInGame);
	}

	async handleDisconnect(socket: AuthenticatedSocket) {
		console.log('Connection closed1');
		// console.log(socket.user);
		socket.leave(`@${socket.user.sub}`);
		if (socket.user) {
			const newStatus = await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'online' },
			});
		}

		this.userId = socket.user.sub;
		const queue = this.getStratQueue(this.userId);
		if (queue) {
			if (queue.sockets.length === 1)
				this.queueWaiting = this.queueWaiting.filter(
					(queue) => queue.userId !== this.userId,
				);
			else queue.sockets = queue.sockets.filter((id) => id !== socket.id);
			// console.log('queueWaitingt: ', this.queueWaiting);
		} else {
			const findGame = this.getInGameQueue(this.userId);
			if (findGame) {
				let isUser1 = null;
				if (findGame.user1 === this.userId) {
					findGame.socket1 = findGame.socket1.filter((id) => id !== socket.id);
					if (findGame.socket1.length === 0 && findGame.status === 'playing') {
						console.log('user1 leave game');
						isUser1 = 'user1';
					}
				} else {
					findGame.socket2 = findGame.socket2.filter((id) => id !== socket.id);
					if (findGame.socket2.length === 0 && findGame.status === 'playing') {
						console.log('user2 leave game');
						isUser1 = 'user2';
					}
				}
				if (findGame.socket1.length === 0 || findGame.socket2.length === 0) {
					// this.emitToGame(this.userId, {}, '');
					// await this.sleep(2000);
					// if ((findGame.socket1.length === 0 || findGame.socket2.length === 0) && isUser1) {
					// console.log('he is really leave');
					// this.queueInGame = this.queueInGame.filter(
					// 	(queue) =>
					// 		this.userId !== queue.user1 && this.userId !== queue.user2,
					// );
					if (isUser1 === 'user1') {
						this.playerOneScore = 0;
						this.playerTwoScore = 7;
					} else {
						this.playerOneScore = 7;
						this.playerTwoScore = 0;
					}
					this.endGame();
					// return;
					// }
					// console.log('he is back???');
				}
			}
			// console.log('queueInGame: ', this.queueInGame);
			// console.log('queueWaiting: ', this.queueWaiting);
		}
	}

	// @SubscribeMessage('joinGame')
	// async handleJoinGame(client: AuthenticatedSocket, data: any) {
	// 	console.log('join game');
	// 	this.mapIndex = 0;
	// 	// console.log("index:", this.mapIndex)
	// 	this.pushSocketToQueue(client.user.sub, client.id, 0);
	// 	if (this.queueWaiting.length >= 2) await this.checkQueue();
	// 	console.log('waitting: ', this.queueWaiting);
	// 	console.log('inGame: ', this.queueInGame);
	// }

	//emit to user a message in an event---------------------------------------
	emitToGame(userId: string, payload: any, event: string) {
		// if (!this.game) return;
		// const socketIds = [...this.game.socket1, ...this.game.socket2];

		// socketIds.forEach((socketId) => {
		// 	this.server.to(socketId).emit(event, payload);
		// });
		this.server.to(`@${this.user1.id}`).emit(event, payload);
		//emit to room @this.user2
		this.server.to(`@${this.user2.id}`).emit(event, payload);
	}

	emitToUser1InGame(userId: string, payload: any, event: string) {
		if (!this.game) return 1337;
		// const socketIds = this.game.socket1;

		// socketIds.forEach((socketId) => {
		// 	this.server.to(socketId).emit(event, payload);
		// });
		this.server.to(`@${this.user1.id}`).emit(event, payload);
		return 1;
	}

	emitToUser2InGame(userId: string, payload: any, event: string) {
		if (!this.game) return 1338;
		// const socketIds = this.game.socket2;

		// socketIds.forEach((socketId) => {
		// 	this.server.to(socketId).emit(event, payload);
		// });
		this.server.to(`@${this.user2.id}`).emit(event, payload);
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
			const userIdOne = map[0].userId;
			const userIdTwo = map[1].userId;
			this.user1 = await this.gameservice.findUserById(userIdOne);
			this.user2 = await this.gameservice.findUserById(userIdTwo);
			this.queueWaiting = this.queueWaiting.filter(
				(queue) => queue.userId !== userIdOne && queue.userId !== userIdTwo,
			);
			this.queueInGame.push({
				user1: userIdOne,
				user2: userIdTwo,
				status: 'pending',
				socket1: map[0].sockets,
				socket2: map[1].sockets,
				duration: Date.now(),
				indexMap: map[0].indexMap,
			});

			map = map.filter(
				(queue) => queue.userId !== userIdOne && queue.userId !== userIdTwo,
			);

			this.game = this.getInGameQueue(userIdOne);
			const idGame = userIdOne;

			// eveeeeeeent
			this.emitToUser2InGame(
				userIdTwo,
				{ opponent: this.user1, rotate: true, idGame },
				'knowOpponent',
			);
			this.emitToUser1InGame(
				userIdTwo,
				{ opponent: this.user2, rotate: false, idGame },
				'knowOpponent',
			);
			// await this.sleep(3000);
			if (!this.game) return;
			console.log('test startgame +++++++++++++++');
			this.emitToUser1InGame(userIdTwo, { idGame }, 'startGame');

			this.emitToUser2InGame(userIdTwo, { idGame }, 'startGame');

			// this.emitToUser1InGame(userIdTwo, { opponentId: userIdTwo }, 'startGame');
			// this.emitToUser2InGame(userIdOne, { opponentId: userIdOne }, "startGame");

			this.game.status = 'playing';
		}
		return;
	}
	// Queue---------------------------------------

	getStratQueue(userId: string) {
		return this.queueWaiting.find((queue) => queue.userId === userId);
	}

	getInGameQueue(userId: string) {
		return this.queueInGame.find(
			(queue) => queue.user1 === userId || queue.user2 === userId,
		);
	}

	pushSocketToQueue(userId: string, socketId: string, indexMap?: number) {
		if (this.queueInGame.length > 0) {
			const findGame = this.getInGameQueue(userId);
			if (findGame) {
				if (findGame.user1 === userId && !findGame.socket1.includes(socketId)) {
					findGame.socket1.push(socketId);
					console.log('pushSocketToQueue1', this.queueInGame);
				} else if (!findGame.socket2.includes(socketId)) {
					findGame.socket2.push(socketId);
					console.log('pushSocketToQueue2', this.queueInGame);
				}
			}
		} else {
			const findQueue = this.getStratQueue(userId);
			if (findQueue && !findQueue.sockets.includes(socketId))
				findQueue.sockets.push(socketId);
			else
				this.queueWaiting.push({
					userId,
					sockets: [socketId],
					indexMap,
				});
		}
	}

	closeAllSockets(socketsId: any[]) {
		socketsId.forEach((socketId) => {
			socketId.disconnect(true);
		});
	}

	async endGame() {
		const game = this.game;
		if (game) {
			const { user1, user2, duration } = game;
			if (this.playerOneScore > this.playerTwoScore) {
				this.emitToUser1InGame(
					this.userId,
					{ status: 'winner' },
					'gameIsFinished',
				);
				this.emitToUser2InGame(
					this.userId,
					{ status: 'loser' },
					'gameIsFinished',
				);
			} else {
				this.emitToUser2InGame(
					this.userId,
					{ status: 'winner' },
					'gameIsFinished',
				);
				this.emitToUser1InGame(
					this.userId,
					{ status: 'loser' },
					'gameIsFinished',
				);
			}
			// Clear Game
			this.handleClearGame();
			// this.closeAllSockets([...game.socket1 , ...game.socket2]);
			// this.endGame(this.game);
			await this.gameservice.createTwoMatchHistory(
				user1,
				user2,
				this.playerOneScore,
				this.playerTwoScore,
				duration
			)
			this.game = null;
			console.log(this.playerOneScore, this.playerTwoScore);
			this.user1 = '';
			this.user2 = '';
			this.playerOneScore = 0;
			this.playerTwoScore = 0;
			this.queueInGame = this.queueInGame.filter((game) => game.user1 != user1);
		}

		// const history1 = this.gameService.createMatchHistory(user1, user2, score1, score2, duration);
		// const history2 = this.gameService.createMatchHistory(user2, user1, score2, score1, duration);
		// const stateGame = this.gameService.calStateGame(score1, score2);
		// this.emitToUser1InGame(user1, { history1 }, "endGame");
		// this.emitToUser2InGame(user2, { history2 }, "endGame")
	}
	// End Queue---------------------------------------
	@SubscribeMessage('launchGameRequest')
	handleLaunchGameRequest(
		@MessageBody() gameData: any,
		@ConnectedSocket() socket: AuthenticatedSocket,
	) {
		if (!this.game || socket.user.sub === this.game.user1) return;
		// if (!this.game) return;
		this.mapIndex = 0;

		// console.log('map Index:', this.mapIndex);

		// This Function Will Run In All Maps:
		this.handleDefaultGameMap();

		switch (this.mapIndex) {
			case 1:
				this.handleGameCircleObstacles();
				break;

			case 2:
				this.handleVerticalObstacles();
				break;
		}
		console.log(
			this.emitToUser1InGame(
				this.userId,
				{ rotate: false, opponant: this.user2 },
				'launchGame',
			),
		);
		console.log(
			this.emitToUser2InGame(
				this.userId,
				{ rotate: true, opponant: this.user1 },
				'launchGame',
			),
		);

		this.handlePaddleMove();
		this.startGame();
	}

	handleDefaultGameMap() {
		// Create Ball:
		this.ball = Bodies.circle(
			this.defaultCanvasSizes.width / 2,
			this.defaultCanvasSizes.height / 2,
			15,
			{
				label: 'ball',
				render: {
					fillStyle: '#FFF',
				},
				frictionAir: 0,
				friction: 0,
				inertia: Infinity,
				restitution: 1,
			},
		);

		// const topRect = Bodies.rectangle(
		// 	this.canvasWidth / 2,
		// 	0,
		// 	this.canvasWidth,
		// 	20,
		// 	{
		// 		render: {
		// 			fillStyle: 'red',
		// 		},		delete this.queueWaiting[user1];

		// 		isStatic: true,
		// 	},
		// );
		// const bottomRect = Bodies.rectangle(
		// 	this.canvasWidth / 2,
		// 	this.canvasHeight,
		// 	this.canvasWidth,
		// 	20,
		// 	{
		// 		render: {
		// 			fillStyle: 'yellow',
		// 		},
		// 		isStatic: true,
		// 	},
		// );

		// Create Two Paddles:
		this.topPaddle = Bodies.rectangle(
			this.defaultCanvasSizes.width / 2,
			30,
			this.paddleSizes.width,
			this.paddleSizes.height,
			{
				label: 'topPaddle',
				render: {
					fillStyle: '#4FD6FF',
				},
				isStatic: true,
				// chamfer: { radius: 10 },
			},
		);

		this.bottomPaddle = Bodies.rectangle(
			this.defaultCanvasSizes.width / 2,
			this.defaultCanvasSizes.height - 30,
			this.paddleSizes.width,
			this.paddleSizes.height,
			{
				label: 'bottomPaddle',
				render: {
					fillStyle: '#FF5269',
				},
				isStatic: true,
				// chamfer: { radius: 10 },
			},
		);

		// Create Two Boundies:
		this.rightRect = Bodies.rectangle(
			this.defaultCanvasSizes.width,
			this.defaultCanvasSizes.height / 2,
			20,
			this.defaultCanvasSizes.height,
			{
				label: 'rightRect',
				render: {
					fillStyle: '#CFF4FF',
				},
				isStatic: true,
			},
		);

		this.leftRect = Bodies.rectangle(
			0,
			this.defaultCanvasSizes.height / 2,
			20,
			this.defaultCanvasSizes.height,
			{
				label: 'leftRect',
				render: {
					fillStyle: '#CFF4FF',
				},
				isStatic: true,
			},
		);

		this.separator = Bodies.rectangle(
			this.defaultCanvasSizes.width / 2,
			this.defaultCanvasSizes.height / 2,
			this.defaultCanvasSizes.width,
			8,
			{
				isSensor: true,
				render: {
					fillStyle: '#CFF4FF',
				},
			},
		);

		this.centerCirle = Bodies.circle(
			this.defaultCanvasSizes.width / 2,
			this.defaultCanvasSizes.height / 2,
			8,
		);

		Composite.add(engine.world, [
			this.topPaddle,
			this.bottomPaddle,
			this.separator,
			this.centerCirle,
			this.ball,
			this.rightRect,
			this.leftRect,
			// bottomRect,
			// topRect,
		]);

		this.setBallVelocity();

		// Body.setVelocity(this.ball, {
		// 	x: this.ballSpeed.x,
		// 	y: this.ballSpeed.y,
		// });
	}

	handleGameCircleObstacles() {
		this.topLeftObstacle = Bodies.circle(
			this.defaultCanvasSizes.width / 4,
			this.defaultCanvasSizes.height / 4,
			50,
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		this.topRightObstacle = Bodies.circle(
			(3 * this.defaultCanvasSizes.width) / 4,
			this.defaultCanvasSizes.height / 4,
			40,
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		this.bottomRightObstacle = Bodies.circle(
			(3 * this.defaultCanvasSizes.width) / 4,
			(3 * this.defaultCanvasSizes.height) / 4,
			50,
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		this.bottomLeftObstacle = Bodies.circle(
			this.defaultCanvasSizes.width / 4,
			(3 * this.defaultCanvasSizes.height) / 4,
			40,
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		Composite.add(engine.world, [
			this.topLeftObstacle,
			this.topRightObstacle,
			this.bottomLeftObstacle,
			this.bottomRightObstacle,
		]);
	}

	handleVerticalObstacles() {
		this.verticalObstacle1 = Bodies.rectangle(
			this.defaultCanvasSizes.width - 65,
			this.defaultCanvasSizes.height / 5,
			15,
			170,
			{
				render: {
					fillStyle: 'white',
				},
				isStatic: true,
			},
		);

		this.verticalObstacle2 = Bodies.rectangle(
			this.defaultCanvasSizes.width / 2,
			this.defaultCanvasSizes.height / 3,
			15,
			100,
			{
				render: {
					fillStyle: 'white',
				},
				isStatic: true,
			},
		);

		this.verticalObstacle3 = Bodies.rectangle(
			65,
			(2 * this.defaultCanvasSizes.height) / 3,
			15,
			170,
			{
				render: {
					fillStyle: 'white',
				},
				isStatic: true,
			},
		);

		this.verticalObstacle4 = Bodies.rectangle(
			this.defaultCanvasSizes.width - 65,
			(4 * this.defaultCanvasSizes.height) / 5,
			15,
			170,
			{
				render: {
					fillStyle: 'white',
				},
				isStatic: true,
			},
		);

		Composite.add(engine.world, [
			this.verticalObstacle1,
			this.verticalObstacle2,
			this.verticalObstacle3,
			this.verticalObstacle4,
		]);
	}

	@SubscribeMessage('keyevent')
	handleKeyDown(@MessageBody() data: any) {
		if (!this.game) return;

		let movingLeft: boolean;
		let movingRight: boolean;

		if (data.state === 'keydown') {
			if (data.key === 'd' || data.key === 'ArrowRight') movingRight = true;
			else if (data.key === 'a' || data.key === 'ArrowLeft') movingLeft = true;
		} else {
			if (data.key === 'd' || data.key === 'ArrowRight') movingRight = false;
			else if (data.key === 'a' || data.key === 'ArrowLeft') movingLeft = false;
		}
		if (data.display_name === this.user1.display_name)
			this.movesUser1 = {
				movingLeft,
				movingRight,
			};
		else {
			this.movesUser2 = {
				movingLeft,
				movingRight,
			};
		}
	}

	handlePaddleMove() {
		this.movePaddleInterval = setInterval(() => {
			if (!this.game) {
				clearInterval(this.updateBallPosition);
				return;
			}
			let stepX1 = 0;

			if (this.movesUser1.movingLeft) {
				stepX1 = this.posBottomPaddleX - 11;
				if (stepX1 <= this.paddleSizes.width / 2)
					stepX1 = this.paddleSizes.width / 2;
			} else if (this.movesUser1.movingRight) {
				stepX1 = this.posBottomPaddleX + 11;
				if (
					stepX1 >=
					this.defaultCanvasSizes.width - this.paddleSizes.width / 2
				)
					stepX1 = this.defaultCanvasSizes.width - this.paddleSizes.width / 2;
			}
			if (stepX1 != 0) {
				this.posBottomPaddleX = stepX1;
				Body.setPosition(this.bottomPaddle, {
					x: stepX1,
					y: this.bottomPaddle.position.y,
				});
			}

			let stepX2 = 0;

			if (this.movesUser2.movingRight) {
				stepX2 = this.posTopPaddleX - 11;
				if (stepX2 <= this.paddleSizes.width / 2)
					stepX2 = this.paddleSizes.width / 2;
			} else if (this.movesUser2.movingLeft) {
				stepX2 = this.posTopPaddleX + 11;
				if (
					stepX2 >=
					this.defaultCanvasSizes.width - this.paddleSizes.width / 2
				)
					stepX2 = this.defaultCanvasSizes.width - this.paddleSizes.width / 2;
			}
			if (stepX2 != 0) {
				this.posTopPaddleX = stepX2;
				Body.setPosition(this.topPaddle, {
					x: stepX2,
					y: this.topPaddle.position.y,
				});
			}
			if (stepX2 || stepX1)
				this.emitToGame(
					this.userId,
					{
						xPosition1: this.posBottomPaddleX,
						xPosition2: this.posTopPaddleX,
					},
					'updatePaddlePosition',
				);
		}, 15);
	}

	startGame() {
		Runner.run(runner, engine);

		this.updateBallPosition = setInterval(() => {
			if (!this.game) {
				clearInterval(this.updateBallPosition);
				return;
			}
			this.emitToGame(this.userId, this.ball.position, 'updateBallPosition');
			this.calcScore();
		}, 15);
	}

	resetToDefaultPosition() {
		// Reset Ball Position
		Body.setPosition(this.ball, {
			x: this.defaultCanvasSizes.width / 2,
			y: this.defaultCanvasSizes.height / 2,
		});

		// Reset Paddles Position
		Body.setPosition(this.topPaddle, {
			x: this.defaultCanvasSizes.width / 2,
			y: 30,
		});

		Body.setPosition(this.bottomPaddle, {
			x: this.defaultCanvasSizes.width / 2,
			y: this.defaultCanvasSizes.height - 30,
		});
	}

	setBallVelocity() {
		// Random Value Between A Range
		// Math.floor(Math.random() * (max - min + 1)) + min;

		if (this.lastDirection === 'top') {
			this.currentBallVelocity = {
				x: Math.floor(Math.random() * 11) - 5,
				y: -4,
			};
		} else {
			this.currentBallVelocity = {
				x: Math.floor(Math.random() * 11) - 5,
				y: 4,
			};
		}

		Body.setVelocity(this.ball, {
			x: this.currentBallVelocity.x,
			y: this.currentBallVelocity.y,
		});

		this.emitToGame(this.userId, this.ball.velocity, 'setBallVelocity');
	}

	updateBallVelocity() {
		// Limit Velocity Value
		if (this.currentBallVelocity.y === 10 || this.currentBallVelocity.y === -10)
			return;
		else if (this.lastDirection === 'top') this.currentBallVelocity.y -= 1;
		else this.currentBallVelocity.y += 1;

		Body.setVelocity(this.ball, {
			x: this.ball.velocity.x,
			y: this.currentBallVelocity.y,
		});
	}

	emitScore() {
		if (this.ball.position.y < this.topPaddle.position.y) {
			this.playerOneScore++;
			this.lastDirection = 'top';
		} else if (this.ball.position.y > this.bottomPaddle.position.y) {
			this.playerTwoScore++;
			this.lastDirection = 'bottom';
		}
		this.emitToUser1InGame(
			this.userId,
			{
				yourScore: this.playerOneScore,
				opponantScore: this.playerTwoScore,
			},
			'updateScore',
		);
		this.emitToUser2InGame(
			this.userId,
			{
				yourScore: this.playerTwoScore,
				opponantScore: this.playerOneScore,
			},
			'updateScore',
		);
		this.resetToDefaultPosition();
	}

	getScore() {
		const game = this.getInGameQueue(this.userId);
		if (game) {
			// if (this.userId === game.user1)
			// else if (this.userId === game.user2)
		}
	}

	calcScore() {
		if (
			this.ball.position.y > this.bottomPaddle.position.y ||
			this.ball.position.y < this.topPaddle.position.y
		)
			this.emitScore();
		if (this.playerOneScore === 7 || this.playerTwoScore === 7) {
			this.endGame();
		}
	}

	handleClearGame() {
		const displayBodies = (str: string) => {
			console.log(str);
			for (let body of engine.world.bodies) console.log(body);
		};

		displayBodies('before');

		// Remove Basic Bodies In Default Map
		Composite.remove(engine.world, this.topPaddle);
		Composite.remove(engine.world, this.bottomPaddle);
		Composite.remove(engine.world, this.rightRect);
		Composite.remove(engine.world, this.leftRect);
		Composite.remove(engine.world, this.ball);
		Composite.remove(engine.world, this.centerCirle);
		Composite.remove(engine.world, this.separator);

		// Remove Obstacles For Map 1 && 2
		if (this.mapIndex === 1) {
			console.log('index 1 chosen');
			Composite.remove(engine.world, this.topLeftObstacle);
			Composite.remove(engine.world, this.topRightObstacle);
			Composite.remove(engine.world, this.bottomLeftObstacle);
			Composite.remove(engine.world, this.bottomRightObstacle);
		} else if (this.mapIndex === 2) {
			console.log('index 1 chosen');
			Composite.remove(engine.world, this.verticalObstacle1);
			Composite.remove(engine.world, this.verticalObstacle2);
			Composite.remove(engine.world, this.verticalObstacle3);
			Composite.remove(engine.world, this.verticalObstacle4);
		}

		displayBodies('after');

		// Clear Intervals:
		clearInterval(this.movePaddleInterval);
		clearInterval(this.updateBallPosition);

		// clearTimeout Of Paddle Game Runner:
		// clearTimeout(this.lunchGameInterval);

		// Stop The Runner:
		Runner.stop(runner);

		// Clear Engine:
		Engine.clear(engine);
		World.clear(engine.world, false);

		// Close Socket!
		// clearInterval(this.moveInterval);
		// this.socket.disconnect();
	}
}
