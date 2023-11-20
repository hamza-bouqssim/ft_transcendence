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
	origin:['http://localhost:3000'],
	credentials : true,
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

	private pong: any;

	constructor(private readonly gameservice : GameService) {
		this.handlePaddleMove();
		// console.log("cons")
	}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket);
			console.log('A Pong client connected!');
		});
		this.handleLaunchGame();
	}

	handleLaunchGame() {
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
			x: 8,
			y: 8,
		});
		this.server.emit("setBallVelocity", this.ball.velocity)

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
			bottomRect,
			topRect,
		]);

		// run the engine:
		Runner.run(Runner.create(), engine);

		const gameInterval = setInterval(() => {
			this.server.emit('updateBallPosition', this.ball.position);
		}, 15);
	}

	@SubscribeMessage("join-game")
	handleJoinGame()
	{
		this.server.emit("join-queue", {
			content: "join-queue Event!"
		})
		// this.gameservice.joinQueue();
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
		const moveInterval = setInterval(() => {
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
					y: this.bottomPaddle.position.y
				})
				this.server.emit('updatePaddlePosition', {
					paddleLabel: 'bottomPaddle',
					xPosition: stepX,
				});
			}
		}, 20);
	}

}
