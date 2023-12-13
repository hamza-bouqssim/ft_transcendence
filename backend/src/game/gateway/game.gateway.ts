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

const engine = Engine.create({
	gravity: {
		x: 0,
		y: 0,
	},
});

const runner: any = Runner.create();

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

	private defaultCanvasSizes: any = {
		width: 560,
		height: 836,
	};
	private paddleSizes: any = {
		width: 170,
		height: 15,
	};
	private ballSpeed: any = {
		x: 2.5,
		y: 2.5,
	};

	private ball: any;
	private topPaddle: any;
	private bottomPaddle: any;
	private rightRect: any;
	private leftRect: any;
	private movesUser1 = {
		movingRight: false,
		movingLeft: false,
	};
	private movesUser2 = {
		movingRight: false,
		movingLeft: false,
	};
	private posTopPaddleX = this.defaultCanvasSizes.width / 2;
	private posBottomPaddleX = this.defaultCanvasSizes.width / 2;
	private playerOneScore: number = 0;
	private playerTwoScore: number = 0;
	private updateBallPosition: any;
	private movePaddleInterval: any;
	private mapIndex: number;
	private userId: string;
	private user1: any;
	private user2: any;
	private game: GameQ;
	private queueWaiting: {
		userId: string;
		sockets: string[];
		indexMap: number;
	}[] = [];

	private queueGame: GameQ[] = [];

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
		this.pushSocket(this.userId, socket.id, 0);
		if (this.queueWaiting.length >= 2) await this.checkQueue();
	}

	async handleDisconnect(socket: AuthenticatedSocket) {
		console.log('Connection closed1');
		socket.leave(`@${socket.user.sub}`);
		if (socket.user) {
			const newStatus = await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'online' },
			});
		}

		this.userId = socket.user.sub;
		const queue = this.getQueueWaiting(this.userId);
		if (queue) {
			if (queue.sockets.length === 1)
				this.queueWaiting = this.queueWaiting.filter(
					(queue) => queue.userId !== this.userId,
				);
			else queue.sockets = queue.sockets.filter((id) => id !== socket.id);
		} else {
			const findGame = this.getQueueGame(this.userId);
			if (findGame) {
				if (findGame.user1 === this.userId) {
					findGame.socket1 = findGame.socket1.filter((id) => id !== socket.id);
					if (findGame.socket1.length === 0 && findGame.status === 'playing') {
						console.log('user1 leave game');
					}
				} else {
					findGame.socket2 = findGame.socket2.filter((id) => id !== socket.id);
					if (findGame.socket2.length === 0 && findGame.status === 'playing') {
						console.log('user2 leave game');
					}
				}
				if ((findGame.socket1.length === 0 || findGame.socket2.length === 0)) {

					if (findGame.socket1.length === 0 && this.game) {
						this.playerOneScore = 0;
						this.playerTwoScore = 7;
					} else {
						this.playerOneScore = 7;
						this.playerTwoScore = 0;
					}
					console.log('end game1');
					await this.endGame();

				}
			}
		}
	}

	// async handleDisconnect(socket: AuthenticatedSocket) {
	// 	console.log('Connection closed1');
	// 	socket.leave(`@${socket.user.sub}`);
	// 	if (socket.user) {
	// 		const newStatus = await this.prisma.user.update({
	// 			where: { id: socket.user.sub },
	// 			data: { status: 'online' },
	// 		});
	// 	}

	// 	this.userId = socket.user.sub;
	// 	const queue = this.getQueueWaiting(this.userId);
	// 	if (queue) {
	// 		if (queue.sockets.length === 1)
	// 			this.queueWaiting = this.queueWaiting.filter(
	// 				(queue) => queue.userId !== this.userId,
	// 			);
	// 		else queue.sockets = queue.sockets.filter((id) => id !== socket.id);
	// 	} else {
	// 		const findGame = this.getQueueGame(this.userId);
	// 		if (findGame) {
	// 			if (findGame.user1 === this.userId) {
	// 				findGame.socket1 = findGame.socket1.filter((id) => id !== socket.id);
	// 				if (findGame.socket1.length === 0 && findGame.status === 'playing') {

	// 					// start timer
	// 					console.log('user1 leave game');
	// 					this.emitToGame(this.userId, {}, 'stopGame');
	// 					await this.sleep(10000);
	// 					if(findGame.socket1.length === 0 && this.game)
	// 					{
	// 						this.playerOneScore = 0;
	// 						this.playerTwoScore = 7;
	// 						this.endGame();
	// 						return;
	// 					}
	// 					// end timer
	// 				}
	// 			} else {
	// 				findGame.socket2 = findGame.socket2.filter((id) => id !== socket.id);
	// 				if (findGame.socket2.length === 0 && findGame.status === 'playing') {
	// 					// start timer
	// 					console.log('user2 leave game');
	// 					this.emitToGame(this.userId, {}, 'stopGame');
	// 					await this.sleep(10000);
	// 					if(findGame.socket2.length === 0 && this.game)
	// 					{
	// 						this.playerOneScore = 7;
	// 						this.playerTwoScore = 0;
	// 						this.endGame();
	// 						return;
	// 					}
	// 					// end timer
	// 				}
	// 			}
	// 		}
	// 	}
	// }


	// @SubscribeMessage('joinGame')
	// async handleJoinGame(client: AuthenticatedSocket, data: any) {
	// 	console.log('join game');
	// 	this.mapIndex = 0;
	// 	// console.log("index:", this.mapIndex)
	// 	this.pushSocket(client.user.sub, client.id, 0);
	// 	if (this.queueWaiting.length >= 2) await this.checkQueue();
	// 	console.log('waitting: ', this.queueWaiting);
	// 	console.log('inGame: ', this.queueGame);
	// }

	//emit to user a message in an event---------------------------------------
	emitToGame(userId: string, payload: any, event: string) {
		this.server.to(`@${this.user1.id}`).emit(event, payload);
		this.server.to(`@${this.user2.id}`).emit(event, payload);
	}

	emitToUser1InGame(userId: string, payload: any, event: string) {
		if (!this.game) return;
		this.server.to(`@${this.user1.id}`).emit(event, payload);
	}

	emitToUser2InGame(userId: string, payload: any, event: string) {
		if (!this.game) return;
		this.server.to(`@${this.user2.id}`).emit(event, payload);
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
			this.queueGame.push({
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

			this.game = this.getQueueGame(userIdOne);
			const idGame = userIdOne;

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
			if (!this.game) return;
			console.log('test startgame +++++++++++++++');
			this.emitToUser1InGame(userIdTwo, { idGame }, 'startGame');

			this.emitToUser2InGame(userIdTwo, { idGame }, 'startGame');

			this.game.status = 'playing';
		}
		return;
	}
	// Queue---------------------------------------

	getQueueWaiting(userId: string) {
		return this.queueWaiting.find((queue) => queue.userId === userId);
	}

	getQueueGame(userId: string) {
		return this.queueGame.find(
			(queue) => queue.user1 === userId || queue.user2 === userId,
		);
	}

	pushSocket(userId: string, socketId: string, indexMap?: number) {
		if (this.queueGame.length > 0) {
			const findGame = this.getQueueGame(userId);
			if (findGame) {
				if (findGame.user1 === userId && !findGame.socket1.includes(socketId)) {
					// if (findGame.socket1.length === 0)
						// emit he is back
					// else
						// emit anthor socket join
					findGame.socket1.push(socketId);
					console.log('pushSocket1', this.queueGame);
				} else if (!findGame.socket2.includes(socketId)) {
					// if (findGame.socket2.length === 0)
						// emit he is back
					// else
						// emit anthor socket join
					findGame.socket2.push(socketId);
					console.log('pushSocket2', this.queueGame);
				}
			}
		} else {
			const findQueue = this.getQueueWaiting(userId);
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
			await this.gameservice.createTwoMatchHistory(
				user2,
				user1,
				this.playerTwoScore,
				this.playerOneScore,
				duration,
			);
			this.game = null;
			console.log(this.playerOneScore, this.playerTwoScore);
			this.user1 = '';
			this.user2 = '';
			this.playerOneScore = 0;
			this.playerTwoScore = 0;
			this.queueGame = this.queueGame.filter((game) => game.user1 != user1);
		}

	}
	// End Queue---------------------------------------
	@SubscribeMessage('launchGameRequest')
	handleLaunchGameRequest(
		@MessageBody() gameData: any,
		@ConnectedSocket() socket: AuthenticatedSocket,
	) {
		if (!this.game || socket.user.sub !== this.game.user2) return;
		this.mapIndex = 0;
		this.handleDefaultGameMap();

		switch (this.mapIndex) {
			case 1:
				this.handleGameCircleObstacles();
				break;

			case 2:
				this.handleVerticalObstacles();
				break;
		}
		this.emitToUser1InGame(
			this.userId,
			{ rotate: false, opponant: this.user2 },
			'launchGame',
		);
		this.emitToUser2InGame(
			this.userId,
			{ rotate: true, opponant: this.user1 },
			'launchGame',
		);
		this.handlePaddleMove();
		this.game.duration = Date.now();
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

		Body.setVelocity(this.ball, {
			x: this.ballSpeed.x,
			y: this.ballSpeed.y,
		});

		this.emitToGame(this.userId, this.ball.velocity, 'setBallVelocity');

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

		const separator = Bodies.rectangle(
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

		const centerCirle = Bodies.circle(
			this.defaultCanvasSizes.width / 2,
			this.defaultCanvasSizes.height / 2,
			8,
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

		const topRightObstacle = Bodies.circle(
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

		const bottomRightObstacle = Bodies.circle(
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

		const bottomLeftObstacle = Bodies.circle(
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
			topLeftObstacle,
			topRightObstacle,
			bottomLeftObstacle,
			bottomRightObstacle,
		]);
	}

	handleVerticalObstacles() {
		const verticalObstacle1 = Bodies.rectangle(
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

		const verticalObstacle2 = Bodies.rectangle(
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

		const verticalObstacle3 = Bodies.rectangle(
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

		const verticalObstacle4 = Bodies.rectangle(
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
			verticalObstacle1,
			verticalObstacle2,
			verticalObstacle3,
			verticalObstacle4,
		]);
	}

	@SubscribeMessage('keyevent')
	handleKeyDown(@MessageBody() data: any) {
		if (!this.game) return;
		let movingLeft: any;
		let movingRight: any;

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

	// applyMove(movesUser: any, posPaddle: number, paddle: any, isButtom: boolean) {
	// 	let stepX = 0;

	// 	if (movesUser.movingLeft) {
	// 		stepX = posPaddle - 11;
	// 		if (stepX <= this.paddleSizes.width / 2)
	// 			stepX = this.paddleSizes.width / 2;
	// 	} else if (movesUser.movingRight) {
	// 		stepX = posPaddle + 11;
	// 		if (stepX >= this.defaultCanvasSizes.width - this.paddleSizes.width / 2)
	// 			stepX = this.defaultCanvasSizes.width - this.paddleSizes.width / 2;
	// 	}
	// 	if (stepX != 0) {
	// 		posPaddle = stepX;
	// 		Body.setPosition(paddle, {
	// 			x: stepX,
	// 			y: paddle.position.y,
	// 		});
	// 		this.emitToGame(
	// 			this.userId,
	// 			{
	// 				xPosition: stepX,
	// 			},
	// 			'updatePaddlePosition',
	// 		);
	// 	}
	// 	if (isButtom) this.posBottomPaddleX = posPaddle;
	// 	else this.posTopPaddleX = posPaddle;
	// }

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
				// this.emitToGame(
				// 	this.userId,
				// 	{
				// 		xPosition1: stepX1,
				// 		xPosition2: this.bottomPaddle.position.x,
				// 	},
				// 	'updatePaddlePosition',
				// );
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

			// this.applyMove(this.movesUser1, this.posBottomPaddleX, this.bottomPaddle,true)
			// this.applyMove(this.movesUser2, this.posTopPaddleX, this.topPaddle,false)
		}, 15);
	}

	startGame() {
		Runner.run(Runner.create(), engine);

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
		Body.setPosition(this.bottomPaddle, {
			x: this.defaultCanvasSizes.width / 2,
			y: this.defaultCanvasSizes.height - 30,
		});
	}

	emitScore() {
		if (this.ball.position.y < this.topPaddle.position.y) this.playerOneScore++;
		else if (this.ball.position.y > this.bottomPaddle.position.y)
			this.playerTwoScore++;
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
		// this.sound.win.play();
		this.resetToDefaultPosition();
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

		// Close Socket!
		// clearInterval(this.moveInterval);
		// this.socket.disconnect();
	}
}
