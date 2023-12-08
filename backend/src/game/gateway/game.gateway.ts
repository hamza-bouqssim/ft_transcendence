import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayDisconnect,
	OnGatewayConnection,
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
	private mapIndex: any;
	private userId: any;
	private user1: any;
	private user2: any;
	private game: GameQ;
	private queueStartGame: {
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
		if (socket.user) {
			const newStatus = await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'ingame' },
			});
		}
		this.userId = socket.user.sub;
		if (this.queueInGame.length > 0) {
			const findGame = this.getInGameQueue(this.userId);
			if (findGame) {
				if (findGame.user1 === this.userId) {
					console.log('pushSocketToQueue1', this.queueInGame);
					findGame.socket1.push(socket.id);
				} else {
					console.log('pushSocketToQueue2', this.queueInGame);
					findGame.socket2.push(socket.id);
				}
			}
		} else {
			const findQueue = this.getStratQueue(this.userId);
			if (findQueue) this.getStratQueue(this.userId).sockets.push(socket.id);
		}
		console.log('waitting0', this.queueStartGame);
		console.log('ingame0', this.queueInGame);
	}

	async handleDisconnect(socket: AuthenticatedSocket) {
		console.log('Connection closed');
		console.log(socket.user);
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
				this.queueStartGame = this.queueStartGame.filter(
					(queue) => queue.userId !== this.userId,
				);
			else queue.sockets = queue.sockets.filter((id) => id !== socket.id);
			console.log('queueStartGamet d', this.queueStartGame);
		} else {
			const findGame = this.getInGameQueue(this.userId);
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
				if (findGame.socket1.length === 0 || findGame.socket2.length === 0) {
					this.queueInGame = this.queueInGame.filter(
						(queue) =>
							this.userId !== queue.user1 && this.userId !== queue.user2,
					);
					this.game = null;
				}
			}
			console.log('queueInGame d', this.queueInGame);
			console.log('queueStartGame d', this.queueStartGame);
		}
	}

	@SubscribeMessage('joinGame')
	async handleJoinGame(client: AuthenticatedSocket, data: any) {
		console.log('join game');
		this.mapIndex = 0;
		// console.log("index:", this.mapIndex)
		this.pushSocketToQueue(client.user.sub, client.id, 0);
		if (this.queueStartGame.length >= 2) await this.checkQueue();
		console.log('waitting1', this.queueStartGame);
		console.log('inGame1', this.queueInGame);
	}
	//emit to user a message in an event---------------------------------------
	emitToGame(userId: string, payload: any, event: string) {
		if (!this.game) return;
		const socketIds = [...this.game.socket1, ...this.game.socket2];

		socketIds.forEach((socketId) => {
			this.server.to(socketId).emit(event, payload);
		});
	}

	emitToUser1InGame(userId: string, payload: any, event: string) {
		if (!this.game) return;
		const socketIds = this.game.socket1;

		socketIds.forEach((socketId) => {
			this.server.to(socketId).emit(event, payload);
		});
	}

	emitToUser2InGame(userId: string, payload: any, event: string) {
		if (!this.game) return;
		const socketIds = this.game.socket2;

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
		if (!map) return;
		while (map.length >= 2) {
			const userIdOne = map[0].userId;
			const userIdTwo = map[1].userId;
			this.user1 = await this.gameservice.findUserById(userIdOne);
			this.user2 = await this.gameservice.findUserById(userIdTwo);
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

			this.game = this.getInGameQueue(userIdOne);
			const idGame = userIdOne;

			await this.sleep(4000);
			if (!this.game) return;
			console.log('test startgame +++++++++++++++');
			this.emitToUser1InGame(
				userIdTwo,
				{ opponent: this.user2, idGame },
				'startGame',
			);

			this.emitToUser2InGame(
				userIdTwo,
				{ opponent: this.user1, idGame },
				'startGame',
			);

			// this.emitToUser1InGame(userIdTwo, { opponentId: userIdTwo }, 'startGame');
			// this.emitToUser2InGame(userIdOne, { opponentId: userIdOne }, "startGame");

			this.game.status = 'playing';
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
				if (findGame.user1 === userId && !findGame.socket1.includes(socketId)) {
					console.log('pushSocketToQueue1', this.queueInGame);
					findGame.socket1.push(socketId);
				} else if (!findGame.socket2.includes(socketId)) {
					console.log('pushSocketToQueue2', this.queueInGame);
					findGame.socket2.push(socketId);
				}
			}
		} else {
			const findQueue = this.getStratQueue(userId);
			if (findQueue && !findQueue.sockets.includes(socketId))
				findQueue.sockets.push(socketId);
			else
				this.queueStartGame.push({
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

	endGame(game: any) {
		const { user1, user2, duration } = game;

		// const history1 = this.gameService.createMatchHistory(user1, user2, score1, score2, duration);
		// const history2 = this.gameService.createMatchHistory(user2, user1, score2, score1, duration);
		// const stateGame = this.gameService.calStateGame(score1, score2);
		// this.emitToUser1InGame(user1, { history1 }, "endGame");
		// this.emitToUser2InGame(user2, { history2 }, "endGame")
		this.queueInGame = this.queueInGame.filter((game) => game.user1 != user1);
	}
	// End Queue---------------------------------------

	@SubscribeMessage('launchGameRequest')
	async handleLaunchGameRequest(@MessageBody() gameData: any) {
		if (!this.game || gameData.user === this.user1.display_name) return;
		this.mapIndex = 0;

		// Update Canvas. Paddles && ball Size With New Mapped Values:
		this.currentCanvasSizes = {
			width: gameData.width,
			height: gameData.height,
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
			'----------------------------------------------------test197----------------------------------------------------',
		);
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
		this.emitToGame(this.userId, this.ball.velocity, 'setBallVelocity');

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
		// 		},		delete this.queueStartGame[user1];

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

	applyMove(movesUser: any, posPaddle: number, paddle: any, isButtom: boolean) {
		let stepX = 0;

		if (movesUser.movingLeft) {
			stepX = posPaddle - 11;
			if (stepX <= this.paddleSizes.width / 2)
				stepX = this.paddleSizes.width / 2;
		} else if (movesUser.movingRight) {
			stepX = posPaddle + 11;
			if (stepX >= this.currentCanvasSizes.width - this.paddleSizes.width / 2)
				stepX = this.currentCanvasSizes.width - this.paddleSizes.width / 2;
		}
		if (stepX != 0) {
			posPaddle = stepX;
			Body.setPosition(paddle, {
				x: stepX,
				y: paddle.position.y,
			});
			this.emitToGame(
				this.userId,
				{
					xPosition: stepX,
				},
				'updatePaddlePosition',
			);
		}
		if (isButtom) this.posBottomPaddleX = posPaddle;
		else this.posTopPaddleX = posPaddle;
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
					this.currentCanvasSizes.width - this.paddleSizes.width / 2
				)
					stepX1 = this.currentCanvasSizes.width - this.paddleSizes.width / 2;
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
					this.currentCanvasSizes.width - this.paddleSizes.width / 2
				)
					stepX2 = this.currentCanvasSizes.width - this.paddleSizes.width / 2;
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

	emitScore() {
		if (this.ball.position.y > this.bottomPaddle.position.y)
			this.playerOneScore++;
		else if (this.ball.position.y < this.topPaddle.position.y)
			this.playerTwoScore++;
		this.emitToGame(
			this.userId,
			{
				playerOneScore: this.playerOneScore,
				playerTwoScore: this.playerTwoScore,
			},
			'updateScore',
		);
		// this.sound.win.play();
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
		if (this.playerOneScore >= 10 || this.playerTwoScore >= 10) {
			// TODO: later We Will Close The Socket With The Specific SocketID:
			if (this.game) {
				this.emitToGame(this.userId, {}, 'gameIsFinished');
				// Clear Game
				this.handleClearGame();
				// this.closeAllSockets([...game.socket1 , ...game.socket2]);
				this.endGame(this.game);
				this.game = null;
				console.log(this.playerOneScore, this.playerTwoScore);
				this.user1 = '';
				this.user2 = '';
				this.playerOneScore = 0;
				this.playerTwoScore = 0;
			}
			console.log('emitted finished game!');
			console.log('waitting0', this.queueStartGame);
			console.log('ingame0', this.queueInGame);
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
