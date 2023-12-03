import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayDisconnect,
	OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { Bodies, Composite, Engine, Runner, Body, World } from 'matter-js';
import { GameService } from '../game.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { whichWithAuthenticated } from 'src/user/utils/auth-utils';
import { AuthenticatedSocket } from 'src/utils/interfaces';

const engine = Engine.create({
	gravity: {
		x: 0,
		y: 0,
	},
});

const runner: any = Runner.create();

@WebSocketGateway({
	origin: ['http://localhost:3000'],
	credentials: true,
	namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	// export class GameGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server;

	// private canvasWidth: number = 560;
	// private canvasHeight: number = 836;
	private defaultCanvasSizes: any = {
		width: 560,
		height: 836,
	};
	private currentCanvasSizes: any = {
		width: this.defaultCanvasSizes.width,
		height: this.defaultCanvasSizes.height,
	};
	private paddleSizes: any = {
		width: 170,
		height: 15,
	};
	private currentBallSpeed: any = {
		x: 4,
		y: 4,
	};
	private map = (
		inputSize: number,
		defaultCanvasSize: number,
		currentCanvasSize: number,
	): number => {
		return (inputSize * currentCanvasSize) / defaultCanvasSize;
	};
	private ball: any;
	private topPaddle: any;
	private bottomPaddle: any;
	private rightRect: any;
	private leftRect: any;
	private movingRight: boolean = false;
	private movingLeft: boolean = false;
	private posPaddleX = this.defaultCanvasSizes.width / 2;
	private playerOneScore: number = 0;
	private playerTwoScore: number = 0;
	private updateBallPosition: any;
	private movePaddleInterval: any;
	private userId: string;
	private mapIndex: number;
	private queueStartGame: {
		userId: string;
		sockets: string[];
		indexMap: number;
	}[] = [];
	private queueInGame: {
		indexMap: number;
		user1: string;
		user2: string;
		status: string;
		socket1: string[];
		socket2: string[];
		duration: number;
	}[] = [];

	constructor(
		private readonly gameservice: GameService,
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
	) {
		this.handlePaddleMove();
	}
	sleep = async (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	// async getUserId(token: string) {
	// 	const decodedToken = this.jwtService.decode(token) as {
	// 		[key: string]: any;
	// 	};
	// 	let user: any;

	// 	if (decodedToken && decodedToken.email) {
	// 		user = await this.prisma.user.findUnique({
	// 			where: { email: decodedToken.email },
	// 		});
	// 		console.log(user);
	// 		// console.log("connect1", this.queueInGame);
	// 		return user.id;
	// 	}
	// }

	// extractTokenFromConnection(client: Socket): any | null {
	// 	// Implement your logic to extract the token from the connection.
	// 	// For example, if tokens are passed in query parameters:
	// 	let token;
	// 	const tokenQueryParam = client.handshake.query.token;
	// 	const tokenTmp = client.handshake.headers.cookie;

	// 	if (tokenTmp && typeof tokenTmp === 'string') {
	// 		const cookies = tokenTmp.split(';');
	// 		const tokenCookie = cookies.find((cookie) =>
	// 			cookie.trim().startsWith('token='),
	// 		);
	// 		if (tokenCookie) {
	// 			token = tokenCookie.split('=')[1];
	// 		} else {
	// 			token = null;
	// 		}
	// 	} else {
	// 		token = null;
	// 	}

	// 	// If tokens are passed in headers:
	// 	const tokenHeader = client.handshake.headers['authorization'];

	// 	return tokenQueryParam || tokenHeader || token;
	// }

	async handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
		console.log('new Incoming connection');
		console.log(socket.user);
		if (socket.user) {
			const newStatus = await this.prisma.user.update({
				where: { id: socket.user.id },
				data: { status: 'ingame' },
			});
		}
		const userId = socket.user.id;
		if (this.queueInGame.length > 0) {
			const findGame = this.getInGameQueue(userId);
			if (findGame) {
				if (findGame.user1 === userId) {
					console.log('pushSocketToQueue1', this.queueInGame);
					findGame.socket1.push(socket.id);
				} else {
					console.log('pushSocketToQueue2', this.queueInGame);
					findGame.socket2.push(socket.id);
				}
			}
		}
		console.log('waitting', this.queueStartGame);
		console.log('ingame', this.queueInGame);
	}

	async handleDisconnect(socket: AuthenticatedSocket) {
		console.log('Connection closed');
		console.log(socket.user);
		if (socket.user) {
			const newStatus = await this.prisma.user.update({
				where: { id: socket.user.id },
				data: { status: 'online' },
			});
		}
		const userId = socket.user.id;
		const queue = this.getStratQueue(userId);
		if (queue) {
			if (queue.sockets.length === 1)
				this.queueStartGame = this.queueStartGame.filter(
					(queue) => queue.userId !== userId,
				);
			else queue.sockets = queue.sockets.filter((id) => id !== socket.id);
			console.log('queueStartGamet d', this.queueStartGame);
		} else {
			const findGame = this.getInGameQueue(userId);
			if (findGame) {
				if (findGame.user1 === userId) {
					findGame.socket1 = findGame.socket1.filter((id) => id !== socket.id);
					if (findGame.socket1.length === 0) {
						console.log('user1 leave game');
					}
				} else {
					findGame.socket2 = findGame.socket2.filter((id) => id !== socket.id);
					if (findGame.socket2.length === 0) console.log('user2 leave game');
				}
				if (findGame.socket1.length === 0 || findGame.socket2.length === 0)
					this.queueInGame = this.queueInGame.filter(
						(queue) => userId !== queue.user1 && userId !== queue.user2,
					);
			}
			console.log('queueInGame d', this.queueInGame);
			console.log('queueStartGame d', this.queueStartGame);
		}
	}

	// async handleConnection(client: any) {
	// 	// const user = whichWithAuthenticated(req)
	// 	// const token;
	// 	console.log('+++++');
	// 	const token = this.extractTokenFromConnection(client);
	// 	if (token === null) return;
	// 	const userId = await this.getUserId(token);
	// 	if (this.queueInGame.length > 0) {
	// 		const findGame = this.getInGameQueue(userId);
	// 		if (findGame) {
	// 			if (findGame.user1 === userId) {
	// 				console.log('pushSocketToQueue1', this.queueInGame);
	// 				findGame.socket1.push(client.id);
	// 			} else {
	// 				console.log('pushSocketToQueue2', this.queueInGame);
	// 				findGame.socket2.push(client.id);
	// 			}
	// 		}
	// 	}
	// 	console.log('waitting', this.queueStartGame);
	// 	console.log('ingame', this.queueInGame);
	// 	// console.log("connect1", this.queueInGame);
	// }

	// async handleDisconnect(client: any) {
	// 	console.log(client.handshake);
	// 	const token = this.extractTokenFromConnection(client);
	// 	const userId = await this.getUserId(token);
	// 	const queue = this.getStratQueue(userId);
	// 	if (queue) {
	// 		if (queue.sockets.length === 1)
	// 			this.queueStartGame = this.queueStartGame.filter(
	// 				(queue) => queue.userId !== userId,
	// 			);
	// 		else queue.sockets = queue.sockets.filter((id) => id !== client.id);
	// 		console.log('queueStartGamet d', this.queueStartGame);
	// 	} else {
	// 		const findGame = this.getInGameQueue(userId);
	// 		if (findGame) {
	// 			if (findGame.user1 === userId) {
	// 				findGame.socket1 = findGame.socket1.filter((id) => id !== client.id);
	// 				if (findGame.socket1.length === 0) {
	// 					console.log('user1 leave game');
	// 				}
	// 			} else {
	// 				findGame.socket2 = findGame.socket2.filter((id) => id !== client.id);
	// 				if (findGame.socket2.length === 0) console.log('user2 leave game');
	// 			}
	// 			if (findGame.socket1.length === 0 || findGame.socket2.length === 0)
	// 				this.queueInGame = this.queueInGame.filter(
	// 					(queue) => userId !== queue.user1 && userId !== queue.user2,
	// 				);
	// 		}
	// 		console.log('queueInGame d', this.queueInGame);
	// 	}
	// }

	@SubscribeMessage('joinGame')
	handleJoinGame(client: Socket, data: any) {
		console.log('test--------------');
		this.userId = data.userData.id;
		this.mapIndex = data.mapIndex;
		// console.log("index:", this.mapIndex)
		this.pushSocketToQueue(this.userId, client.id, 0);
		if (this.queueStartGame.length >= 2) this.checkQueue();
		console.log('waitting', this.queueStartGame);
		console.log('inGame', this.queueInGame);
	}

	//emit to user a message in an event---------------------------------------
	emitToGame(userId: string, payload: any, event: string) {
		const queue = this.queueInGame.find(
			(game) => game.user2 === userId || game.user1 === userId,
		);
		const socketIds = [...queue.socket1, ...queue.socket2];

		socketIds.forEach((socketId) => {
			console.log(socketId, '++++++++++++++++++---------------------->>>>');
			this.server.to(socketId).emit(event, payload);
		});
	}

	emitToUser1InGame(userId: string, payload: any, event: string) {
		const socketIds = this.queueInGame.find(
			(game) => game.user2 === userId || game.user1 === userId,
		).socket1;

		socketIds.forEach((socketId) => {
			this.server.to(socketId).emit(event, payload);
		});
	}

	emitToUser2InGame(userId: string, payload: any, event: string) {
		const socketIds = this.queueInGame.find(
			(game) => game.user2 === userId || game.user1 === userId,
		).socket2;

		socketIds.forEach((socketId) => {
			this.server.to(socketId).emit(event, payload);
		});
	}

	//get map that readu to play in it-------------------------
	mapReadyToPlay() {
		const map = this.queueStartGame.filter((queue) => queue.indexMap === 0);
		const map1 = this.queueStartGame.filter((queue) => queue.indexMap === 1);
		const map2 = this.queueStartGame.filter((queue) => queue.indexMap === 2);
		if (map.length >= 2) return map;
		if (map1.length >= 2) return map1;
		if (map2.length >= 2) return map2;
	}

	//try to lunch game------------------------------
	async checkQueue() {
		let map = this.mapReadyToPlay();
		console.log('checkQueue', this.queueStartGame);
		if (!map) return;
		while (map.length >= 2) {
			const userIdOne = map[0].userId;
			const userIdTwo = map[1].userId;
			this.queueStartGame = this.queueStartGame.filter(
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
			const currentGame = this.getInGameQueue(userIdOne);
			console.log(`${userIdTwo}++++++++++++++++++++++++++++++++++++++++++`);
			const idGame = userIdOne + userIdTwo;
			await this.sleep(4000);
			this.emitToGame(
				userIdTwo,
				{ opponentId: userIdTwo, idGame },
				'startGame',
			);
			console.log('testtting');
			// this.emitToUser1InGame(userIdTwo, { opponentId: userIdTwo }, 'startGame');
			// this.emitToUser2InGame(userIdOne, { opponentId: userIdOne }, "startGame");
			currentGame.status = 'playing';
		}
		return;
	}
	// Queue---------------------------------------

	getStratQueue(userId: string) {
		return this.queueStartGame.find((queue) => queue.userId === userId);
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
				if (findGame.user1 === userId) {
					console.log('pushSocketToQueue1', this.queueInGame);
					findGame.socket1.push(socketId);
				} else {
					console.log('pushSocketToQueue2', this.queueInGame);
					findGame.socket2.push(socketId);
				}
			}
		} else {
			const findQueue = this.getStratQueue(userId);
			if (findQueue) this.getStratQueue(userId).sockets.push(socketId);
			else
				this.queueStartGame.push({
					userId,
					sockets: [socketId],
					indexMap,
				});
		}
	}

	// End Queue---------------------------------------

	@SubscribeMessage('launchGameRequest')
	handleLaunchGameRequest(@MessageBody() gameData: any) {
		this.mapIndex = gameData.chosenMapIndex;

		// Update Canvas. Paddles && ball Size With New Mapped Values:
		this.currentCanvasSizes = {
			width: gameData.canvasSizes.width,
			height: gameData.canvasSizes.height,
		};

		this.paddleSizes = {
			width: this.map(
				this.paddleSizes.width,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			height: this.map(
				this.paddleSizes.height,
				this.defaultCanvasSizes.height,
				this.currentCanvasSizes.height,
			),
		};

		this.currentBallSpeed = {
			x: this.map(
				this.currentBallSpeed.x,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			y: this.map(
				this.currentBallSpeed.y,
				this.defaultCanvasSizes.height,
				this.currentCanvasSizes.height,
			),
		};

		console.log('map Index:', this.mapIndex);

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

		this.server.emit('launchGame', {});
		this.startGame();
	}

	handleDefaultGameMap() {
		// Create Ball:
		this.ball = Bodies.circle(
			this.currentCanvasSizes.width / 2,
			this.currentCanvasSizes.height / 2,
			this.map(
				15,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
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

		Body.setVelocity(this.ball, {
			x: this.currentBallSpeed.x,
			y: this.currentBallSpeed.y,
		});
		this.server.emit('setBallVelocity', this.ball.velocity);

		// Create Two Paddles:
		this.topPaddle = Bodies.rectangle(
			this.currentCanvasSizes.width / 2,
			this.map(
				30,
				this.defaultCanvasSizes.height,
				this.currentCanvasSizes.height,
			),
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
			this.currentCanvasSizes.width / 2,
			this.currentCanvasSizes.height -
				this.map(
					30,
					this.defaultCanvasSizes.height,
					this.currentCanvasSizes.height,
				),
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

		// const topRect = Bodies.rectangle(
		// 	this.canvasWidth / 2,
		// 	0,
		// 	this.canvasWidth,
		// 	20,
		// 	{
		// 		render: {
		// 			fillStyle: 'red',
		// 		},
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

		// Create Two Boundies:
		this.rightRect = Bodies.rectangle(
			this.currentCanvasSizes.width,
			this.currentCanvasSizes.height / 2,
			this.map(
				20,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			this.currentCanvasSizes.height,
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
			this.currentCanvasSizes.height / 2,
			this.map(
				20,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			this.currentCanvasSizes.height,
			{
				label: 'leftRect',
				render: {
					fillStyle: '#CFF4FF',
				},
				isStatic: true,
			},
		);

		const separator = Bodies.rectangle(
			this.currentCanvasSizes.width / 2,
			this.currentCanvasSizes.height / 2,
			this.currentCanvasSizes.width,
			this.map(
				8,
				this.defaultCanvasSizes.height,
				this.currentCanvasSizes.height,
			),
			{
				isSensor: true,
				render: {
					fillStyle: '#CFF4FF',
				},
			},
		);

		const centerCirle = Bodies.circle(
			this.currentCanvasSizes.width / 2,
			this.currentCanvasSizes.height / 2,
			this.map(8, this.defaultCanvasSizes.width, this.currentCanvasSizes.width),
			{
				isSensor: true,
				render: {
					fillStyle: '#CFF4FF',
				},
			},
		);

		Composite.add(engine.world, [
			this.topPaddle,
			this.bottomPaddle,
			separator,
			centerCirle,
			this.ball,
			this.rightRect,
			this.leftRect,
			// bottomRect,
			// topRect,
		]);
	}

	handleGameCircleObstacles() {
		const topLeftObstacle = Bodies.circle(
			this.currentCanvasSizes.width / 4,
			this.currentCanvasSizes.height / 4,
			this.map(
				50,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		const topRightObstacle = Bodies.circle(
			(3 * this.currentCanvasSizes.width) / 4,
			this.currentCanvasSizes.height / 4,
			this.map(
				40,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		const bottomRightObstacle = Bodies.circle(
			(3 * this.currentCanvasSizes.width) / 4,
			(3 * this.currentCanvasSizes.height) / 4,
			this.map(
				50,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		const bottomLeftObstacle = Bodies.circle(
			this.currentCanvasSizes.width / 4,
			(3 * this.currentCanvasSizes.height) / 4,
			this.map(
				40,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		Composite.add(engine.world, [
			topLeftObstacle,
			topRightObstacle,
			bottomLeftObstacle,
			bottomRightObstacle,
		]);
	}

	handleVerticalObstacles() {
		const verticalObstacle1 = Bodies.rectangle(
			this.currentCanvasSizes.width -
				this.map(
					65,
					this.defaultCanvasSizes.width,
					this.currentCanvasSizes.width,
				),
			this.currentCanvasSizes.height / 5,
			this.map(
				15,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			this.map(
				170,
				this.defaultCanvasSizes.height,
				this.currentCanvasSizes.height,
			),
			{
				render: {
					fillStyle: 'white',
				},
				isStatic: true,
			},
		);

		const verticalObstacle2 = Bodies.rectangle(
			this.currentCanvasSizes.width / 2,
			this.currentCanvasSizes.height / 3,
			this.map(
				15,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			this.map(
				100,
				this.defaultCanvasSizes.height,
				this.currentCanvasSizes.height,
			),
			{
				render: {
					fillStyle: 'white',
				},
				isStatic: true,
			},
		);

		const verticalObstacle3 = Bodies.rectangle(
			this.map(
				65,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			(2 * this.currentCanvasSizes.height) / 3,
			this.map(
				15,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			this.map(
				170,
				this.defaultCanvasSizes.height,
				this.currentCanvasSizes.height,
			),
			{
				render: {
					fillStyle: 'white',
				},
				isStatic: true,
			},
		);

		const verticalObstacle4 = Bodies.rectangle(
			this.currentCanvasSizes.width -
				this.map(
					65,
					this.defaultCanvasSizes.width,
					this.currentCanvasSizes.width,
				),
			(4 * this.currentCanvasSizes.height) / 5,
			this.map(
				15,
				this.defaultCanvasSizes.width,
				this.currentCanvasSizes.width,
			),
			this.map(
				170,
				this.defaultCanvasSizes.height,
				this.currentCanvasSizes.height,
			),
			{
				render: {
					fillStyle: 'white',
				},
				isStatic: true,
			},
		);

		Composite.add(engine.world, [
			verticalObstacle1,
			verticalObstacle2,
			verticalObstacle3,
			verticalObstacle4,
		]);
	}

	startGame() {
		Runner.run(Runner.create(), engine);

		this.updateBallPosition = setInterval(() => {
			this.server.emit('updateBallPosition', this.ball.position);
			this.calScore();
		}, 15);
	}

	resetToDefaultPosition() {
		// Reset Ball Position
		Body.setPosition(this.ball, {
			x: this.currentCanvasSizes.width / 2,
			y: this.currentCanvasSizes.height / 2,
		});

		// Reset Paddles Position
		Body.setPosition(this.bottomPaddle, {
			x: this.currentCanvasSizes.width / 2,
			y:
				this.currentCanvasSizes.height -
				this.map(
					30,
					this.defaultCanvasSizes.height,
					this.currentCanvasSizes.height,
				),
		});
	}

	calScore() {
		if (this.ball.position.y > this.bottomPaddle.position.y) {
			this.playerOneScore++;
			this.server.emit('updateScore', {
				playerOneScore: this.playerOneScore,
				playerTwoScore: this.playerTwoScore,
			});
			// this.sound.win.play();
			this.resetToDefaultPosition();
		}
		if (this.playerOneScore === 2 || this.playerTwoScore === 2) {
			// TODO: latter We Will Close The Socket With The Specific SocketID:
			this.playerOneScore = 0;
			this.playerTwoScore = 0;
			///////////////////////
			this.server.emit('gameIsFinished', {});

			// Clear Game
			this.handleClearGame();
		}
	}

	handleClearGame() {
		// Clear Intervals:
		clearInterval(this.movePaddleInterval);
		clearInterval(this.updateBallPosition);

		// const displayBodies = (str: string) => {
		// 	console.log(str);
		// 	for (let body of engine.world.bodies) console.log(body);
		// };

		// displayBodies('before');
		for (let body of engine.world.bodies) Composite.remove(engine.world, body);
		// Composite.remove(engine.world, [
		// 	this.bottomPaddle,
		// 	this.ball,
		// 	this.rightRect,
		// ]);
		// displayBodies('after');

		// Remove Events:
		// Events.off(engine, 'collisionStart', this.handleCollisionStart);
		// Events.off(engine, 'beforeUpdate', this.handleBeforeUpdate);

		// clearTimeout Of Paddle Game Runner:
		// clearTimeout(this.lunchGameInterval);

		// Stop The Runner:
		Runner.stop(runner);

		// Clear Engine:
		Engine.clear(engine);
		World.clear(engine.world, false);

		// Remove Listeners:
		// document.removeEventListener('keydown', this.handleKeyDown);
		// document.removeEventListener('keyup', this.handleKeyUp);

		// Close Socket!
		// clearInterval(this.moveInterval);
		// this.socket.disconnect();
	}

	handlePaddleMove() {
		this.movePaddleInterval = setInterval(() => {
			let stepX = 0;

			if (this.movingLeft) {
				stepX = this.posPaddleX - 13;
				if (stepX <= this.paddleSizes.width / 2) {
					stepX = this.paddleSizes.width / 2;
				}
			} else if (this.movingRight) {
				stepX = this.posPaddleX + 13;
				if (
					stepX >=
					this.currentCanvasSizes.width - this.paddleSizes.width / 2
				) {
					stepX = this.currentCanvasSizes.width - this.paddleSizes.width / 2;
				}
			}
			if (stepX != 0) {
				this.posPaddleX = stepX;
				Body.setPosition(this.bottomPaddle, {
					x: stepX,
					y: this.bottomPaddle.position.y,
				});
				this.server.emit('updatePaddlePosition', {
					paddleLabel: 'bottomPaddle',
					xPosition: stepX,
				});
			}
		}, 20);
	}
}
