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
// import {
// 	Bodies,
// 	Composite,
// 	Engine,
// 	Runner,
// 	Body,
// 	World,
// 	Events,
// } from 'matter-js';
import { GameService } from '../game.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { PongGame } from '../classes/PongGame';

// const engine: Engine = Engine.create({
// 	gravity: {
// 		x: 0,
// 		y: 0,
// 	},
// });

// const runner: Runner = Runner.create();

type GameQ = {
	indexMap: number;
	status: string;
	socket1: AuthenticatedSocket;
	socket2: AuthenticatedSocket;
	duration: number;
	user1: any;
	user2: any;
	launch : boolean;
};


@WebSocketGateway({
	origin: ['http://localhost:3000'],
	credentials: true,
	namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private pong: PongGame;

	// private ball: Body;
	// private topPaddle: Body;
	// private bottomPaddle: Body;
	// private rightRect: Body;
	// private leftRect: Body;
	// private centerCirle: Body;
	// private separator: Body;
	// private topLeftObstacle: Body;
	// private topRightObstacle: Body;
	// private bottomLeftObstacle: Body;
	// private bottomRightObstacle: Body;
	// private verticalObstacle1: Body;
	// private verticalObstacle2: Body;
	// private verticalObstacle3: Body;
	// private verticalObstacle4: Body;
	// private defaultCanvasSizes: {
	// 	width: number;
	// 	height: number;
	// } = {
	// 	width: 560,
	// 	height: 836,
	// };
	// private currentBallVelocity: {
	// 	x: number;
	// 	y: number;
	// } = {
	// 	x: 0,
	// 	y: 0,
	// };
	// private paddleSizes: {
	// 	width: number;
	// 	height: number;
	// } = {
	// 	width: 170,
	// 	height: 15,
	// };
	// private lastDirection: string = 'top';
	// private movesUser1: {
	// 	movingRight: boolean;
	// 	movingLeft: boolean;
	// } = {
	// 	movingRight: false,
	// 	movingLeft: false,
	// };
	// private movesUser2: {
	// 	movingRight: boolean;
	// 	movingLeft: boolean;
	// } = {
	// 	movingRight: false,
	// 	movingLeft: false,
	// };
	// private posTopPaddleX = this.defaultCanvasSizes.width / 2;
	// private posBottomPaddleX = this.defaultCanvasSizes.width / 2;
	// private playerOneScore: number = 0;
	// private playerTwoScore: number = 0;
	// private updateBallPosition: NodeJS.Timer;
	// private movePaddleInterval: NodeJS.Timer;
	// private handleCollisionStart = (e: any): void => {};
	private queueWaiting: {
		socket: AuthenticatedSocket;
		indexMap: number;
	}[] = [];
	private queueInGame: GameQ[] = [];

	constructor(
		private readonly gameservice: GameService,
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
	) {}
	// sleep = async (ms: number) =>
	// 	new Promise((resolve) => setTimeout(resolve, ms));

	async handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
		console.log('connect1   ...');
		console.log('socket', socket.user.sub);
		if (socket.user) {
			const newStatus = await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'ingame' },
			});
		}
	}

	async handleDisconnect(socket: AuthenticatedSocket) {
		console.log('Connection closed1');
		socket.leave(`@${socket.user.sub}`);
		const game = this.getInGameQueue(socket.user.sub);
		if (socket.user) {
			const newStatus = await this.prisma.user.update({
				where: { id: socket.user.sub },
				data: { status: 'online' },
			});
		}

		const userId = socket.user.sub;
		const queue = this.getStratQueue(userId);
		if (queue) {
			this.queueWaiting = this.queueWaiting.filter(
				(queue) => queue.socket.user.sub !== userId,
			);
		} else {
			const findGame = this.getInGameQueue(userId);
			if (findGame) {
				if (findGame.socket1.user.sub  === userId && socket.id === findGame.socket1.id) {
					console.log('user1 leave game');
					this.pong.playerOneScore = 0;
					this.pong.playerTwoScore = 7;
					this.endGame(game);
				} else if (
					findGame.socket2.user.sub  === userId &&
					socket.id === findGame.socket2.id
				) {
					console.log('user2 leave game');
					this.pong.playerOneScore = 7;
					this.pong.playerTwoScore = 0;
					this.endGame(game);
				}
			}
		}
	}


	@SubscribeMessage('startGame')
	async handleJoinGame(client: AuthenticatedSocket, data: any) {
		if (Number(data.indexMap) > 2 || Number(data.indexMap) < 0) return;
		client.join(`@${client.user.sub}`);
		this.queueWaiting.push({
			indexMap: Number(data.indexMap),
			socket: client,
		});

		if (this.queueWaiting.length >= 2) await this.checkQueue();
	}

	// emit to user a message in an event---------------------------------------
	emitToGame(user1: string, user2: string, payload: any, event: string) {
		this.server.to(`@${user1}`).emit(event, payload);
		this.server.to(`@${user2}`).emit(event, payload);
	}

	emitToUser1InGame(userId: string,payload: any, event: string) {
		this.server.to(`@${userId}`).emit(event, payload);
		return 1;
	}

	emitToUser2InGame(userId: string,payload: any, event: string) {
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
			const userIdOne = map[0].socket.user.sub ;
			const userIdTwo = map[1].socket.user.sub ;
			const user1 = await this.gameservice.findUserById(userIdOne);
			const user2 = await this.gameservice.findUserById(userIdTwo);
			this.queueWaiting = this.queueWaiting.filter(
				(queue) => queue.socket.user.sub  !== userIdOne && queue.socket.user.sub  !== userIdTwo,
			);
			this.queueInGame.push({
				status: 'pending',
				socket1: map[0].socket,
				socket2: map[1].socket,
				duration: Date.now(),
				indexMap: map[0].indexMap,
				user1: user1,
				user2: user2,
				launch : false,
			});

			map = map.filter(
				(queue) => queue.socket.user.sub  !== userIdOne && queue.socket.user.sub  !== userIdTwo,
			);

			const game = this.getInGameQueue(userIdOne);
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
	getStratQueue(userId: string) {
		return this.queueWaiting.find((queue) => queue.socket.user.sub  === userId);
	}

	getInGameQueue(userId: string) {
		return this.queueInGame.find(
			(queue) => queue.socket1.user.sub  === userId || queue.socket2.user.sub  === userId,
		);
	}


	async endGame(game : any) {
		if (game) {
			const  user1 = game.socket1.user.sub ;
			const  user2 = game.socket2.user.sub ;
			const duration = Date.now() - game.duration;
			if (this.pong.playerOneScore > this.pong.playerTwoScore) {
				this.emitToUser1InGame(user1, { status: 'winner' }, 'gameIsFinished');
				this.emitToUser2InGame(user2 ,{ status: 'loser' }, 'gameIsFinished');
			} else {
				this.emitToUser2InGame(user2 ,{ status: 'winner' }, 'gameIsFinished');
				this.emitToUser1InGame(user1 ,{ status: 'loser' }, 'gameIsFinished');
			}
			// Clear Game
			// this.handleClearGame();
			// await this.gameservice.createTwoMatchHistory(
			// 	user1,
			// 	user2,
			// 	this.playerOneScore,
			// 	this.playerTwoScore,
			// 	duration,
			// );
			console.log(this.pong.playerOneScore, this.pong.playerTwoScore);
			this.pong.playerOneScore = 0;
			this.pong.playerTwoScore = 0;
			this.queueInGame = this.queueInGame.filter((game) => game.socket1.user.sub  != user1);
		}
	}
	// End Queue---------------------------------------
	@SubscribeMessage('launchGameRequest')
	handleLaunchGameRequest(
		@MessageBody() gameData: any,
		@ConnectedSocket() socket: AuthenticatedSocket,
	) {
		const game = this.getInGameQueue(socket.user.sub);
		if(!game) return;	
		if(game && !game.launch && (game.socket1.id === socket.id || game.socket2.id === socket.id)){
			game.launch = true;
			return;
		}

		this.pong = new PongGame(this, game);

		// // This Function Will Run In All Maps:
		// this.handleDefaultGameMap();

		// switch (this.mapIndex) {
		// 	case 1:
		// 		this.handleGameCircleObstacles();
		// 		break;

		// 	case 2:
		// 		this.handleVerticalObstacles();
		// 		break;
		// }
		// console.log(
		// 	this.emitToUser1InGame(
		// 		{ rotate: false, opponant: this.user2 },
		// 		'launchGame',
		// 	),
		// );
		// console.log(
		// 	this.emitToUser2InGame(
		// 		{ rotate: true, opponant: this.user1 },
		// 		'launchGame',
		// 	),
		// );

		// this.handlePaddleMove();
		// this.startGame();
	}

	// handleDefaultGameMap() {
	// 	// Create Ball:
	// 	this.ball = Bodies.circle(
	// 		this.defaultCanvasSizes.width / 2,
	// 		this.defaultCanvasSizes.height / 2,
	// 		15,
	// 		{
	// 			label: 'ball',
	// 			render: {
	// 				fillStyle: '#FFF',
	// 			},
	// 			frictionAir: 0,
	// 			friction: 0,
	// 			inertia: Infinity,
	// 			restitution: 1,
	// 		},
	// 	);

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
	// 	this.topPaddle = Bodies.rectangle(
	// 		this.defaultCanvasSizes.width / 2,
	// 		30,
	// 		this.paddleSizes.width,
	// 		this.paddleSizes.height,
	// 		{
	// 			label: 'topPaddle',
	// 			render: {
	// 				fillStyle: '#4FD6FF',
	// 			},
	// 			isStatic: true,
	// 			// chamfer: { radius: 10 },
	// 		},
	// 	);

	// 	this.bottomPaddle = Bodies.rectangle(
	// 		this.defaultCanvasSizes.width / 2,
	// 		this.defaultCanvasSizes.height - 30,
	// 		this.paddleSizes.width,
	// 		this.paddleSizes.height,
	// 		{
	// 			label: 'bottomPaddle',
	// 			render: {
	// 				fillStyle: '#FF5269',
	// 			},
	// 			isStatic: true,
	// 			// chamfer: { radius: 10 },
	// 		},
	// 	);

	// 	// Create Two Boundies:
	// 	this.rightRect = Bodies.rectangle(
	// 		this.defaultCanvasSizes.width,
	// 		this.defaultCanvasSizes.height / 2,
	// 		20,
	// 		this.defaultCanvasSizes.height,
	// 		{
	// 			label: 'rightRect',
	// 			render: {
	// 				fillStyle: '#CFF4FF',
	// 			},
	// 			isStatic: true,
	// 		},
	// 	);

	// 	this.leftRect = Bodies.rectangle(
	// 		0,
	// 		this.defaultCanvasSizes.height / 2,
	// 		20,
	// 		this.defaultCanvasSizes.height,
	// 		{
	// 			label: 'leftRect',
	// 			render: {
	// 				fillStyle: '#CFF4FF',
	// 			},
	// 			isStatic: true,
	// 		},
	// 	);

	// 	this.separator = Bodies.rectangle(
	// 		this.defaultCanvasSizes.width / 2,
	// 		this.defaultCanvasSizes.height / 2,
	// 		this.defaultCanvasSizes.width,
	// 		8,
	// 		{
	// 			isSensor: true,
	// 			render: {
	// 				fillStyle: '#CFF4FF',
	// 			},
	// 		},
	// 	);

	// 	this.centerCirle = Bodies.circle(
	// 		this.defaultCanvasSizes.width / 2,
	// 		this.defaultCanvasSizes.height / 2,
	// 		8,
	// 	);

	// 	Composite.add(engine.world, [
	// 		this.topPaddle,
	// 		this.bottomPaddle,
	// 		this.separator,
	// 		this.centerCirle,
	// 		this.ball,
	// 		this.rightRect,
	// 		this.leftRect,
	// 		// bottomRect,
	// 		// topRect,
	// 	]);

	// 	this.setBallVelocity();
	// }

	// handleGameCircleObstacles() {
	// 	this.topLeftObstacle = Bodies.circle(
	// 		this.defaultCanvasSizes.width / 4,
	// 		this.defaultCanvasSizes.height / 4,
	// 		50,
	// 		{
	// 			isStatic: true,
	// 			render: {
	// 				fillStyle: 'white',
	// 			},
	// 		},
	// 	);

	// 	this.topRightObstacle = Bodies.circle(
	// 		(3 * this.defaultCanvasSizes.width) / 4,
	// 		this.defaultCanvasSizes.height / 4,
	// 		40,
	// 		{
	// 			isStatic: true,
	// 			render: {
	// 				fillStyle: 'white',
	// 			},
	// 		},
	// 	);

	// 	this.bottomRightObstacle = Bodies.circle(
	// 		(3 * this.defaultCanvasSizes.width) / 4,
	// 		(3 * this.defaultCanvasSizes.height) / 4,
	// 		50,
	// 		{
	// 			isStatic: true,
	// 			render: {
	// 				fillStyle: 'white',
	// 			},
	// 		},
	// 	);

	// 	this.bottomLeftObstacle = Bodies.circle(
	// 		this.defaultCanvasSizes.width / 4,
	// 		(3 * this.defaultCanvasSizes.height) / 4,
	// 		40,
	// 		{
	// 			isStatic: true,
	// 			render: {
	// 				fillStyle: 'white',
	// 			},
	// 		},
	// 	);

	// 	Composite.add(engine.world, [
	// 		this.topLeftObstacle,
	// 		this.topRightObstacle,
	// 		this.bottomLeftObstacle,
	// 		this.bottomRightObstacle,
	// 	]);
	// }

	// handleVerticalObstacles() {
	// 	this.verticalObstacle1 = Bodies.rectangle(
	// 		this.defaultCanvasSizes.width - 65,
	// 		this.defaultCanvasSizes.height / 5,
	// 		15,
	// 		170,
	// 		{
	// 			render: {
	// 				fillStyle: 'white',
	// 			},
	// 			isStatic: true,
	// 		},
	// 	);

	// 	this.verticalObstacle2 = Bodies.rectangle(
	// 		this.defaultCanvasSizes.width / 2,
	// 		this.defaultCanvasSizes.height / 3,
	// 		15,
	// 		100,
	// 		{
	// 			render: {
	// 				fillStyle: 'white',
	// 			},
	// 			isStatic: true,
	// 		},
	// 	);

	// 	this.verticalObstacle3 = Bodies.rectangle(
	// 		65,
	// 		(2 * this.defaultCanvasSizes.height) / 3,
	// 		15,
	// 		170,
	// 		{
	// 			render: {
	// 				fillStyle: 'white',
	// 			},
	// 			isStatic: true,
	// 		},
	// 	);

	// 	this.verticalObstacle4 = Bodies.rectangle(
	// 		this.defaultCanvasSizes.width - 65,
	// 		(4 * this.defaultCanvasSizes.height) / 5,
	// 		15,
	// 		170,
	// 		{
	// 			render: {
	// 				fillStyle: 'white',
	// 			},
	// 			isStatic: true,
	// 		},
	// 	);

	// 	Composite.add(engine.world, [
	// 		this.verticalObstacle1,
	// 		this.verticalObstacle2,
	// 		this.verticalObstacle3,
	// 		this.verticalObstacle4,
	// 	]);
	// }

	@SubscribeMessage('keyevent')
	handleKeyDown(@MessageBody() data: any,	@ConnectedSocket() socket: AuthenticatedSocket) {
		const game = this.getInGameQueue(socket.user.sub);
		if (!game) return;

		this.pong.handleKeyDown(data);

		// let movingLeft: boolean;
		// let movingRight: boolean;

		// if (data.state === 'keydown') {
		// 	if (data.key === 'd' || data.key === 'ArrowRight') movingRight = true;
		// 	else if (data.key === 'a' || data.key === 'ArrowLeft') movingLeft = true;
		// } else {
		// 	if (data.key === 'd' || data.key === 'ArrowRight') movingRight = false;
		// 	else if (data.key === 'a' || data.key === 'ArrowLeft') movingLeft = false;
		// }
		// if (data.display_name === this.user1.display_name)
		// 	this.movesUser1 = {
		// 		movingLeft,
		// 		movingRight,
		// 	};
		// else {
		// 	this.movesUser2 = {
		// 		movingLeft,
		// 		movingRight,
		// 	};
		// }
	}

	// handlePaddleMove() {
	// 	this.movePaddleInterval = setInterval(() => {
	// 		if (!this.game) {
	// 			clearInterval(this.updateBallPosition);
	// 			return;
	// 		}
	// 		let stepX1 = 0;

	// 		if (this.movesUser1.movingLeft) {
	// 			stepX1 = this.posBottomPaddleX - 11;
	// 			if (stepX1 <= this.paddleSizes.width / 2)
	// 				stepX1 = this.paddleSizes.width / 2;
	// 		} else if (this.movesUser1.movingRight) {
	// 			stepX1 = this.posBottomPaddleX + 11;
	// 			if (
	// 				stepX1 >=
	// 				this.defaultCanvasSizes.width - this.paddleSizes.width / 2
	// 			)
	// 				stepX1 = this.defaultCanvasSizes.width - this.paddleSizes.width / 2;
	// 		}
	// 		if (stepX1 != 0) {
	// 			this.posBottomPaddleX = stepX1;
	// 			Body.setPosition(this.bottomPaddle, {
	// 				x: stepX1,
	// 				y: this.bottomPaddle.position.y,
	// 			});
	// 		}

	// 		let stepX2 = 0;

	// 		if (this.movesUser2.movingRight) {
	// 			stepX2 = this.posTopPaddleX - 11;
	// 			if (stepX2 <= this.paddleSizes.width / 2)
	// 				stepX2 = this.paddleSizes.width / 2;
	// 		} else if (this.movesUser2.movingLeft) {
	// 			stepX2 = this.posTopPaddleX + 11;
	// 			if (
	// 				stepX2 >=
	// 				this.defaultCanvasSizes.width - this.paddleSizes.width / 2
	// 			)
	// 				stepX2 = this.defaultCanvasSizes.width - this.paddleSizes.width / 2;
	// 		}
	// 		if (stepX2 != 0) {
	// 			this.posTopPaddleX = stepX2;
	// 			Body.setPosition(this.topPaddle, {
	// 				x: stepX2,
	// 				y: this.topPaddle.position.y,
	// 			});
	// 		}
	// 		if (stepX2 || stepX1)
	// 			this.emitToGame(
	// 				{
	// 					xPosition1: this.posBottomPaddleX,
	// 					xPosition2: this.posTopPaddleX,
	// 				},
	// 				'updatePaddlePosition',
	// 			);
	// 	}, 15);
	// }

	// startGame() {
	// 	Runner.run(runner, engine);

	// 	this.updateBallPosition = setInterval(() => {
	// 		if (!this.game) {
	// 			clearInterval(this.updateBallPosition);
	// 			return;
	// 		}
	// 		this.emitToGame(this.ball.position, 'updateBallPosition');
	// 		// this.calcScore();
	// 		this.handleDetectCollision();
	// 	}, 15);
	// }

	// resetToDefaultPosition() {
	// 	// Reset Ball Position
	// 	Body.setPosition(this.ball, {
	// 		x: this.defaultCanvasSizes.width / 2,
	// 		y: this.defaultCanvasSizes.height / 2,
	// 	});

	// 	// Reset Ball Speed
	// 	this.setBallVelocity();

	// 	// Reset Paddles Position
	// 	// Body.setPosition(this.topPaddle, {
	// 	// 	x: this.defaultCanvasSizes.width / 2,
	// 	// 	y: 30,
	// 	// });

	// 	// Body.setPosition(this.bottomPaddle, {
	// 	// 	x: this.defaultCanvasSizes.width / 2,
	// 	// 	y: this.defaultCanvasSizes.height - 30,
	// 	// });

	// 	this.emitToGame({}, 'resetDefaultPosition');
	// }

	// setBallVelocity() {
	// 	// Random Value Between A Range
	// 	// Math.floor(Math.random() * (max - min + 1)) + min;
	// 	let randomVelocity = Math.floor(Math.random() * 11) - 5;

	// 	if (randomVelocity >= 0 && randomVelocity < 3) randomVelocity = 3;
	// 	else if (randomVelocity >= -2 && randomVelocity <= 0) randomVelocity = -3;

	// 	if (this.lastDirection === 'top') {
	// 		this.currentBallVelocity = {
	// 			x: randomVelocity,
	// 			y: -4,
	// 		};
	// 	} else {
	// 		this.currentBallVelocity = {
	// 			x: randomVelocity,
	// 			y: 4,
	// 		};
	// 	}

	// 	Body.setVelocity(this.ball, {
	// 		x: this.currentBallVelocity.x,
	// 		y: this.currentBallVelocity.y,
	// 	});

	// 	this.emitToGame(this.ball.velocity, 'setBallVelocity');
	// }

	// updateBallVelocity() {
	// 	// Limit Velocity Value
	// 	if (this.currentBallVelocity.y === 10 || this.currentBallVelocity.y === -10)
	// 		return;
	// 	else {
	// 		if (this.lastDirection === 'top') this.currentBallVelocity.y -= 1;
	// 		else this.currentBallVelocity.y += 1;

	// 		Body.setVelocity(this.ball, {
	// 			x: this.ball.velocity.x,
	// 			y: this.currentBallVelocity.y,
	// 		});

	// 		this.emitToGame(this.ball.velocity, 'setBallVelocity');
	// 	}
	// }

	// emitScore() {
	// 	if (
	// 		this.ball.position.y < this.topPaddle.position.y ||
	// 		this.ball.position.y > this.bottomPaddle.position.y
	// 	) {
	// 		if (this.ball.position.y < this.topPaddle.position.y) {
	// 			this.playerOneScore++;
	// 			this.lastDirection = 'top';
	// 		} else {
	// 			this.playerTwoScore++;
	// 			this.lastDirection = 'bottom';
	// 		}
	// 		this.emitToUser1InGame(
	// 			{
	// 				yourScore: this.playerOneScore,
	// 				opponantScore: this.playerTwoScore,
	// 			},
	// 			'updateScore',
	// 		);
	// 		this.emitToUser2InGame(
	// 			{
	// 				yourScore: this.playerTwoScore,
	// 				opponantScore: this.playerOneScore,
	// 			},
	// 			'updateScore',
	// 		);
	// 		this.resetToDefaultPosition();
	// 	}
	// }

	// handleDetectCollision() {
	// 	this.handleCollisionStart = (e: any): void => {
	// 		const pairs = e.pairs[0];

	// 		if (pairs.bodyA === this.topPaddle || pairs.bodyB === this.topPaddle) {
	// 			// this.sound.topPaddleSound.play();
	// 			this.updateBallVelocity();
	// 		} else if (
	// 			pairs.bodyA === this.bottomPaddle ||
	// 			pairs.bodyB === this.bottomPaddle
	// 		) {
	// 			// this.sound.bottomPaddleSound.play();
	// 			this.updateBallVelocity();
	// 		}
	// 	};

	// 	Events.on(engine, 'collisionStart', this.handleCollisionStart);

	// 	this.calcScore();
	// }

	// calcScore() {
	// 	if (
	// 		this.ball.position.y > this.bottomPaddle.position.y ||
	// 		this.ball.position.y < this.topPaddle.position.y
	// 	)
	// 		this.emitScore();
	// 	if (this.playerOneScore === 7 || this.playerTwoScore === 7) {
	// 		this.endGame();
	// 	}
	// }

	// handleClearGame() {
	// 	const displayBodies = (str: string) => {
	// 		console.log(str);
	// 		for (let body of engine.world.bodies) console.log(body);
	// 	};

	// 	// displayBodies('before');

	// 	// Remove Basic Bodies In Default Map
	// 	Composite.remove(engine.world, this.topPaddle);
	// 	Composite.remove(engine.world, this.bottomPaddle);
	// 	Composite.remove(engine.world, this.rightRect);
	// 	Composite.remove(engine.world, this.leftRect);
	// 	Composite.remove(engine.world, this.ball);
	// 	Composite.remove(engine.world, this.centerCirle);
	// 	Composite.remove(engine.world, this.separator);

	// 	// Remove Obstacles For Map 1 && 2
	// 	if (this.mapIndex === 1) {
	// 		console.log('index 1 chosen');
	// 		Composite.remove(engine.world, this.topLeftObstacle);
	// 		Composite.remove(engine.world, this.topRightObstacle);
	// 		Composite.remove(engine.world, this.bottomLeftObstacle);
	// 		Composite.remove(engine.world, this.bottomRightObstacle);
	// 	} else if (this.mapIndex === 2) {
	// 		console.log('index 1 chosen');
	// 		Composite.remove(engine.world, this.verticalObstacle1);
	// 		Composite.remove(engine.world, this.verticalObstacle2);
	// 		Composite.remove(engine.world, this.verticalObstacle3);
	// 		Composite.remove(engine.world, this.verticalObstacle4);
	// 	}

	// 	// displayBodies('after');

	// 	Events.off(engine, 'collisionStart', this.handleCollisionStart);

	// 	// Clear Intervals:
	// 	clearInterval(this.movePaddleInterval);
	// 	clearInterval(this.updateBallPosition);

	// 	// clearTimeout Of Paddle Game Runner:
	// 	// clearTimeout(this.lunchGameInterval);

	// 	// Stop The Runner:
	// 	Runner.stop(runner);

	// 	// Clear Engine:
	// 	Engine.clear(engine);
	// 	World.clear(engine.world, false);

	// 	// Close Socket!
	// 	// this.socket.disconnect();
	// }
}
