import Ball from './Ball';
import Paddle from './Paddle';
import { Howl } from 'howler';
import Matter from 'matter-js';

const Render = Matter.Render;
const Engine = Matter.Engine;
const Runner = Matter.Runner;
const Composite = Matter.Composite;
const engine = Engine.create({
	gravity: {
		x: 0,
		y: 0,
	},
});

class PongGame {
	private ball: Ball;
	private topPaddle: Paddle;
	private bottomPaddle: Paddle;
	private moveInterval: any;
	private sound = {
		topPaddleSound: new Howl({
			src: ['/assets/sounds/leftPaddle.wav'],
		}),
		bottomPaddleSound: new Howl({
			src: ['/assets/sounds/rightPaddle.wav'],
		}),
		win: new Howl({
			src: ['/assets/sounds/winSound.mp3'],
		}),
	};

	constructor(
		private canvasWidth,
		private canvasHeight,
	) {
		// this.divWidth = this.parentDiv.getBoundingClientRect().width;
		// this.divHeight = this.parentDiv.getBoundingClientRect().height;

		// Ball Data
		this.ball = new Ball(
			this.canvasWidth / 2,
			this.canvasHeight / 2,
			15,
			'#FFF',
		);

		//Paddles Data
		this.topPaddle = new Paddle(this.canvasWidth / 2, 30, 170, 15, '#4FD6FF');

		this.bottomPaddle = new Paddle(
			this.canvasWidth / 2,
			this.canvasHeight - 30,
			170,
			15,
			'#FF5269',
		);

		// const render = Render.create({
		// 	element: this.parentDiv,
		// 	engine: engine,
		// 	options: {
		// 		background: '#3A3561',
		// 		width: this.divWidth,
		// 		height: this.divHeight,
		// 		wireframes: false,
		// 	},
		// });

		//Draw Objects:
		this.ball.draw();
		this.topPaddle.draw();
		this.bottomPaddle.draw();

		const rightRect = Matter.Bodies.rectangle(
			this.canvasWidth,
			this.canvasHeight / 2,
			20,
			this.canvasHeight,
			{
				render: {
					fillStyle: '#CFF4FF',
				},
				isStatic: true,
			},
		);

		const leftRect = Matter.Bodies.rectangle(
			0,
			this.canvasHeight / 2,
			20,
			this.canvasHeight,
			{
				render: {
					fillStyle: '#CFF4FF',
				},
				isStatic: true,
			},
		);

		Composite.add(engine.world, [
			this.ball.body,
			this.topPaddle.body,
			this.bottomPaddle.body,
			rightRect,
			leftRect,
		]);

		// Render.run(render);

		// create runner
		// let runner = Runner.create();

		// run the engine
		// Runner.run(runner, engine);
	}

	resetObjsDefaultPosition = (): void => {
		Matter.Body.setPosition(this.ball.body, {
			x: this.ball.xCord,
			y: this.ball.yCord,
		});
		// clearInterval(this.moveInterval);
	};

	// movePaddle = (): void => {
	// 	document.addEventListener('keydown', (e) => {
	// 		if (e.key === 'd' || e.key === 'ArrowRight')
	// 			this.socket.emit('keyevent', {
	// 				key: e.key,
	// 				state: 'keydown',
	// 			});
	// 		else if (e.key === 'a' || e.key === 'ArrowLeft')
	// 			this.socket.emit('keyevent', {
	// 				key: e.key,
	// 				state: 'keydown',
	// 			});
	// 	});

	// 	document.addEventListener('keyup', (e) => {
	// 		if (e.key === 'd' || e.key === 'ArrowRight')
	// 			this.socket.emit('keyevent', {
	// 				key: e.key,
	// 				state: 'keyup',
	// 			});
	// 		else if (e.key === 'a' || e.key === 'ArrowLeft')
	// 			this.socket.emit('keyevent', {
	// 				key: e.key,
	// 				state: 'keyup',
	// 			});
	// 	});

	// 	this.socket.on('updatePaddlePosition', (data: any) => {
	// 		console.log(data.xPosition);
	// 		Matter.Body.setPosition(this.bottomPaddle.body, {
	// 			x: data.xPosition,
	// 			y: this.bottomPaddle.body.position.y,
	// 		});
	// 	});
	// };

	// moveBotPaddle = () => {
	// 	let currentPositionX;

	// 	Matter.Events.on(engine, 'collisionStart', (e) => {
	// 		const pairs = e.pairs[0];
	// 		// alert(this.divHeight);
	// 		if (
	// 			pairs.bodyA === this.topPaddle.body ||
	// 			pairs.bodyB === this.topPaddle.body
	// 		)
	// 			this.sound.topPaddleSound.play();
	// 		else if (
	// 			pairs.bodyA === this.bottomPaddle.body ||
	// 			pairs.bodyB === this.bottomPaddle.body
	// 		)
	// 			this.sound.bottomPaddleSound.play();
	// 	});

	// 	Matter.Events.on(engine, 'beforeUpdate', () => {
	// 		if (this.ball.body.position.y + this.ball.radius >= this.divHeight - 8) {
	// 			this.sound.win.play();
	// 		}
	// 		currentPositionX = this.ball.body.position.x;
	// 		if (
	// 			this.ball.body.position.y >=
	// 			this.bottomPaddle.body.position.y + this.bottomPaddle.height / 2
	// 		)
	// 			this.resetObjsDefaultPosition();
	// 		else if (
	// 			this.topPaddle.body.position.x + this.topPaddle.width / 2 >=
	// 				this.divWidth &&
	// 			this.ball.body.position.x >= this.divWidth - this.topPaddle.width / 2
	// 		)
	// 			currentPositionX = this.divWidth - this.topPaddle.width / 2;
	// 		else if (
	// 			this.topPaddle.body.position.x - this.topPaddle.width / 2 <= 0 &&
	// 			this.ball.body.position.x <= this.topPaddle.width / 2
	// 		)
	// 			currentPositionX = this.topPaddle.width / 2;

	// 		Matter.Body.setPosition(this.topPaddle.body, {
	// 			x: currentPositionX,
	// 			y: this.topPaddle.body.position.y,
	// 		});
	// 	});
	// };
}

export default PongGame;
