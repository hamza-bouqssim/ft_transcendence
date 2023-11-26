import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { Bodies, Composite, Engine, Runner, Body } from 'matter-js';
import { GameService } from '../game.service';

const engine = Engine.create({
	gravity: {
		x: 0,
		y: 0,
	},
});

@WebSocketGateway({
	origin: ['http://localhost:3000'],
	credentials: true,
	namespace: '/game',
})
export class GameGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	private canvasWidth: number = 560;
	private canvasHeight: number = 836;
	private ball: any;
	private topPaddle: any;
	private bottomPaddle: any;
	private movingRight: boolean = false;
	private movingLeft: boolean = false;
	private posPaddleX = this.canvasWidth / 2;
	private paddleW = 170;
	private playerOneScore: number = 0;
	private playerTwoScore: number = 0;
	private gameInterval: any;
	private moveInterval: any;
	private mapIndex: number;

	// private pong: any;

	constructor(private readonly gameservice: GameService) {
		this.handlePaddleMove();
		// console.log("test")
	}

	onModuleInit() {
		this.server.on('connection', (socket: any) => {
			// console.log(socket);
			console.log('A Pong client connected!');
		});
		// this.handleLaunchGame();
	}
	// handleConnection(socket : AuthenticatedSocket, ...args: any[]) {
	//     console.log("new Incoming connection");
	//     console.log(socket.user);
	//     // this.sessions.setUserSocket(socket.user.id,socket);
	//     // // socket.emit('connected', {status : 'good'});
	//     // console.log("the session is");
	//     // console.log(this.sessions.getSockets());
	//     // if(socket.user.id)
	//     //     console.log(socket.user.email ,"is online");

	// }
	@SubscribeMessage('launchGameRequest')
	handleLaunchGameRequest(@MessageBody() chosenMapIndex: number) {
		this.mapIndex = chosenMapIndex;

		console.log('map Index:', this.mapIndex);
		switch (this.mapIndex) {
			case 0:
				this.handleDefaultGameMap();
				break;
			case 1: {
				this.handleDefaultGameMap();
				this.handleGameCircleObstacles();
				break;
			}
			case 2: {
				this.handleDefaultGameMap();
				this.handleVerticalObstacles();
				break;
			}
		}

		this.server.emit('launchGame', {});
		this.startGame();
	}

	handleDefaultGameMap() {
		// Create Ball:
		this.ball = Bodies.circle(this.canvasWidth / 2, this.canvasHeight / 2, 15, {
			label: 'ball',
			render: {
				fillStyle: '#FFF',
			},
			frictionAir: 0,
			friction: 0,
			inertia: Infinity,
			restitution: 1,
		});

		Body.setVelocity(this.ball, {
			x: 4,
			y: 4,
		});
		this.server.emit('setBallVelocity', this.ball.velocity);

		// Create Two Paddles:
		this.topPaddle = Bodies.rectangle(this.canvasWidth / 2, 30, 170, 15, {
			label: 'topPaddle',
			render: {
				fillStyle: '#4FD6FF',
			},
			isStatic: true,
			chamfer: { radius: 10 },
		});
		this.bottomPaddle = Bodies.rectangle(
			this.canvasWidth / 2,
			this.canvasHeight - 30,
			170,
			15,
			{
				label: 'bottomPaddle',
				render: {
					fillStyle: '#FF5269',
				},
				isStatic: true,
				chamfer: { radius: 10 },
			},
		);

		// Create Two Boundies:
		const topRect = Bodies.rectangle(
			this.canvasWidth / 2,
			0,
			this.canvasWidth,
			20,
			{
				render: {
					fillStyle: 'red',
				},
				isStatic: true,
			},
		);

		const bottomRect = Bodies.rectangle(
			this.canvasWidth / 2,
			this.canvasHeight,
			this.canvasWidth,
			20,
			{
				render: {
					fillStyle: 'yellow',
				},
				isStatic: true,
			},
		);

		const rightRect = Bodies.rectangle(
			this.canvasWidth,
			this.canvasHeight / 2,
			20,
			this.canvasHeight,
			{
				label: 'rightRect',
				render: {
					fillStyle: '#CFF4FF',
				},
				isStatic: true,
			},
		);

		const leftRect = Bodies.rectangle(
			0,
			this.canvasHeight / 2,
			20,
			this.canvasHeight,
			{
				label: 'leftRect',
				render: {
					fillStyle: '#CFF4FF',
				},
				isStatic: true,
			},
		);

		Composite.add(engine.world, [
			this.ball,
			this.topPaddle,
			this.bottomPaddle,
			rightRect,
			leftRect,
			// bottomRect,
			topRect,
		]);
	}

	handleGameCircleObstacles() {
		const topLeftObstacle = Bodies.circle(
			this.canvasWidth / 4,
			this.canvasHeight / 4,
			50,
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		const topRightObstacle = Bodies.circle(
			(3 * this.canvasWidth) / 4,
			this.canvasHeight / 4,
			40,
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		const bottomRightObstacle = Bodies.circle(
			(3 * this.canvasWidth) / 4,
			(3 * this.canvasHeight) / 4,
			50,
			{
				isStatic: true,
				render: {
					fillStyle: 'white',
				},
			},
		);

		const bottomLeftObstacle = Bodies.circle(
			this.canvasWidth / 4,
			(3 * this.canvasHeight) / 4,
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
	};

	handleVerticalObstacles() {
		const verticalObstacle1 = Bodies.rectangle(
			this.canvasWidth - 65,
			this.canvasHeight / 5,
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
			this.canvasWidth / 2,
			this.canvasHeight / 3,
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
			(2 * this.canvasHeight) / 3,
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
			this.canvasWidth - 65,
			(4 * this.canvasHeight) / 5,
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
	};

	startGame() {
		Runner.run(Runner.create(), engine);

		this.gameInterval = setInterval(() => {
			this.server.emit('updateBallPosition', this.ball.position);
			this.calScore();
		}, 15);
	}

	resetToDefaultPosition() {
		// Reset Ball Position
		Body.setPosition(this.ball, {
			x: this.canvasWidth / 2,
			y: this.canvasHeight / 2,
		});

		//Reset Paddles Position
		Body.setPosition(this.bottomPaddle, {
			x: this.canvasWidth / 2,
			y: this.canvasHeight - 30,
		});
	}

	calScore() {
		if (
			this.ball.position.y + this.ball.circleRadius >=
			this.canvasHeight - 8
		) {
			this.playerOneScore++;
			this.server.emit('updateScore', {
				playerOneScore: this.playerOneScore,
				playerTwoScore: this.playerTwoScore,
			});
			this.resetToDefaultPosition();
		}
		if (this.playerOneScore === 2 || this.playerTwoScore === 2) {
			// TODO: latter We Will Close The Socket With The Specific SocketID:
			this.playerOneScore = 0;
			this.playerTwoScore = 0;
			///////////////////////
			this.server.emit('gameIsFinished', {});

			// Clear Intervals:
			clearInterval(this.moveInterval);
			clearInterval(this.gameInterval);
		}
	}

	@SubscribeMessage('join-game')
	handleJoinGame(@MessageBody() data: any) {
		this.server.emit('join-queue', {
			content: data.socketId,
		});
		this.gameservice.joinQueue(data.socketId);
	}

	@SubscribeMessage('keyevent')
	handleKeyDown(@MessageBody() data: any) {
		if (data.state === 'keydown') {
			if (data.key === 'd' || data.key === 'ArrowRight')
				this.movingRight = true;
			else if (data.key === 'a' || data.key === 'ArrowLeft')
				this.movingLeft = true;
		} else {
			if (data.key === 'd' || data.key === 'ArrowRight')
				this.movingRight = false;
			else if (data.key === 'a' || data.key === 'ArrowLeft')
				this.movingLeft = false;
		}
	}

	handlePaddleMove() {
		this.moveInterval = setInterval(() => {
			let stepX = 0;
			const paddleWidth = 170;

			if (this.movingLeft) {
				stepX = this.posPaddleX - 13;
				if (stepX <= this.paddleW / 2) {
					stepX = this.paddleW / 2;
				}
			} else if (this.movingRight) {
				stepX = this.posPaddleX + 13;
				if (stepX >= this.canvasWidth - this.paddleW / 2) {
					stepX = this.canvasWidth - this.paddleW / 2;
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
