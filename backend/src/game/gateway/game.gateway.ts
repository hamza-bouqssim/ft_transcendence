import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import PongGame from '../classes/PongGame';

// const Bodies = Matter.Bodies;
// const Render = Matter.Render;
// const Engine = Matter.Engine;
// const Runner = Matter.Runner;
// const Composite = Matter.Composite;

// const engine = Engine.create();
// const runner = Runner.create();

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class GameGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	private divWidth = 560;
	private divHeight = 836;
	private ballXcord;
	private ballYcord;
	private topPaddleXCord;
	private topPaddleYCord;
	private bottomPaddleXCord;
	private bottomPaddleYCord;
	private movingRight = false;
	private movingLeft = false;
	private posPaddleX = this.divWidth / 2;
	private paddleW = 170;

	private pong: any;

	constructor() {
		this.handlePaddleMove();
	}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('A Pong client connected!');
		});
	}

	@SubscribeMessage('launch-game')
	handleLaunchGame(@MessageBody() data: any) {
		console.log('parent:', data.parentDiv);
		console.log('width:', data.parentDivW);
		console.log('height:', data.parentDivH);
		// this.pong = new PongGame(data.parentCanvasDiv);
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

			if (this.movingLeft) {
				stepX = this.posPaddleX - 11;
				if (stepX <= this.paddleW / 2) {
					stepX = this.paddleW / 2;
				}
			} else if (this.movingRight) {
				stepX = this.posPaddleX + 11;
				if (stepX >= this.divWidth - this.paddleW / 2) {
					stepX = this.divWidth - this.paddleW / 2;
				}
			}
			if (stepX != 0) {
				this.posPaddleX = stepX;
				this.server.emit('updatePaddlePosition', {
					paddleLabel: 'bottomPaddle',
					xPosition: stepX,
				});
			}
		}, 20);
	}
}
