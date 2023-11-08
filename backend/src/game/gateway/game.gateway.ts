import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import Matter from 'matter-js';
// import Ball from './classes/Ball';
// import Paddle from './classes/Paddle';
import { Body, OnModuleInit } from '@nestjs/common';

// const Bodies = Matter.Bodies;
// const Render = Matter.Render;
// const Engine = Matter.Engine;
// const Runner = Matter.Runner;
// const Composite = Matter.Composite;

// const engine = Engine.create();
// const runner = Runner.create();

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:3000'],
	},
})
export class GameGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	// constructor(
	// 	private ball: Ball,
	// 	private rightPaddle: Paddle,
	// 	private leftPaddle: Paddle,
	// ) {}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('a client connected!');
		});
		this.server.on('Position', (payload) => {
			console.log(payload);
		});
	}

	// @SubscribeMessage('setDefaultPosition')
	// emitDefaultPosition() {
	// 	this.server.emit('defaultPosition', {
	// 		x: 120,
	// 		y: 120,
	// 	});
	// }

	@SubscribeMessage('setDefaultPosition')
	emitDefaultPosition(@MessageBody() body: any) {
		console.log(body);
		// this.server.emit('defaultPosition', {
		// 	ballCords: {
		// 		x: 120,
		// 		y: 120,
		// 	},
		// 	paddlesCords: {
		// 		rightPaddleCord: {
		// 			x: 120,
		// 			y: 120,
		// 		},
		// 		leftPaddleCord: {
		// 			x: 120,
		// 			y: 120,
		// 		},
		// 	},
		// });
	}

	// If the ball reaches the canvas boundary, reverse its vertical velocity
	// move = (render: any): void => {
	// 	if (
	// 		this.ball.body.position.y + this.ball.body.circleRadius - 1 >=
	// 			render.canvas.height ||
	// 		this.ball.body.position.y - this.ball.body.circleRadius <= 0
	// 	)
	// 		this.ball.yVelocity = -this.ball.yVelocity;
	// 	if (
	// 		this.ball.body.position.x > render.canvas.width ||
	// 		this.ball.body.position.x < 0
	// 	) {
	// 		this.ball.body.position.x < 0
	// 			? this.rightPaddle.score++
	// 			: this.leftPaddle.score++;
	// 		this.ball.resetPosition();
	// 		this.leftPaddle.resetPosition();
	// 		this.rightPaddle.resetPosition();
	// 	}
	// 	this.ball.setBallSpeed();
	// };

	// delete two this methods and make just one is better
	// isCollidedLeft = (): boolean => {
	// 	if (
	// 		this.ball.body.position.x - this.ball.body.circleRadius <=
	// 			this.leftPaddle.body.position.x + this.leftPaddle.width / 2 &&
	// 		this.ball.body.position.y >=
	// 			this.leftPaddle.body.position.y - this.leftPaddle.height / 2 &&
	// 		this.ball.body.position.y <=
	// 			this.leftPaddle.body.position.y + this.leftPaddle.height / 2
	// 	) {
	// 		this.ball.isSilenced
	// 			? this.ball.sound.leftPaddleSound.pause()
	// 			: this.ball.sound.leftPaddleSound.play();
	// 		return true;
	// 	} else if (this.ball.body.position.x < this.leftPaddle.body.position.x) {
	// 		this.ball.isSilenced
	// 			? this.ball.sound.win.pause()
	// 			: this.ball.sound.win.play();
	// 	}
	// 	return false;
	// };

	// isCollidedRight = (): boolean => {
	// 	if (
	// 		this.ball.body.position.x + this.ball.body.circleRadius >=
	// 			this.rightPaddle.body.position.x - this.rightPaddle.width / 2 &&
	// 		this.ball.body.position.y >=
	// 			this.rightPaddle.body.position.y - this.rightPaddle.height / 2 &&
	// 		this.ball.body.position.y <=
	// 			this.rightPaddle.body.position.y + this.rightPaddle.height / 2
	// 	) {
	// 		this.ball.isSilenced
	// 			? this.ball.sound.rightPaddleSound.pause()
	// 			: this.ball.sound.rightPaddleSound.play();
	// 		return true;
	// 	} else if (
	// 		this.ball.body.position.x + this.ball.body.circleRadius >
	// 		this.rightPaddle.body.position.x
	// 	) {
	// 		this.ball.isSilenced
	// 			? this.ball.sound.win.pause()
	// 			: this.ball.sound.win.play();
	// 	}
	// 	return false;
	// };

	// checkBallHit = (): void => {
	// 	if (this.isCollidedLeft() || this.isCollidedRight()) {
	// 		this.ball.xVelocity = -this.ball.xVelocity;
	// 	}
	// };
}
