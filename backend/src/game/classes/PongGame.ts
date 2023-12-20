import { GameGateway, KeyEventPayload } from '../gateway/game.gateway';
import {
	Bodies,
	Composite,
	Engine,
	Runner,
	Body,
	World,
	Events,
} from 'matter-js';
import { GameQ } from '../gateway/game.gateway';

// const engine: Engine = Engine.create({
// 	gravity: {
// 		x: 0,
// 		y: 0,
// 	},
// });

// const runner: Runner = Runner.create();

export class PongGame {
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
	playerOneScore: number = 0;
	playerTwoScore: number = 0;
	private updateBallPosition: NodeJS.Timeout;
	private movePaddleInterval: NodeJS.Timeout;
	private user1: string;
	private user2: string;
	private engine: Engine;
	private runner: Runner;
	private handleCollisionStart = (e): void => {};
	private mapIndex: number;

	constructor(
		private gameGatway: GameGateway,
		private game: GameQ,
	) {
		this.engine = Engine.create({
			gravity: {
				x: 0,
				y: 0,
			},
		});

		this.runner = Runner.create();
		this.user1 = game.socket1.user.sub;
		this.user2 = game.socket2.user.sub;
		this.mapIndex = game.indexMap;

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

		this.gameGatway.emitToUser1InGame(this.user1, {}, 'launchGame');
		this.gameGatway.emitToUser2InGame(this.user2, {}, 'launchGame');
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

		Composite.add(this.engine.world, [
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

		Composite.add(this.engine.world, [
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
			(3 * this.defaultCanvasSizes.height) / 4,
			15,
			100,
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

		Composite.add(this.engine.world, [
			this.verticalObstacle1,
			this.verticalObstacle2,
			this.verticalObstacle3,
			this.verticalObstacle4,
		]);
	}

	handleKeyDown(data: KeyEventPayload) {
		// if (!this.game) return;

		let movingLeft: boolean;
		let movingRight: boolean;

		if (data.state === 'keydown') {
			if (data.key === 'd' || data.key === 'ArrowRight') movingRight = true;
			else if (data.key === 'a' || data.key === 'ArrowLeft') movingLeft = true;
		} else {
			if (data.key === 'd' || data.key === 'ArrowRight') movingRight = false;
			else if (data.key === 'a' || data.key === 'ArrowLeft') movingLeft = false;
		}
		if (data.display_name === this.game.user1.display_name)
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
				this.gameGatway.emitToGame(
					this.user1,
					this.user2,
					{
						xPosition1: this.posBottomPaddleX,
						xPosition2: this.posTopPaddleX,
					},
					'updatePaddlePosition',
				);
		}, 15);
	}

	startGame() {
		Runner.run(this.runner, this.engine);

		this.updateBallPosition = setInterval(() => {
			if (!this.game) {
				clearInterval(this.updateBallPosition);
				return;
			}
			this.gameGatway.emitToGame(
				this.user1,
				this.user2,
				this.ball.position,
				'updateBallPosition',
			);
			this.calcScore();
		}, 15);
		this.handleDetectCollision();
	}

	resetToDefaultPosition() {
		// Reset Ball Position
		Body.setPosition(this.ball, {
			x: this.defaultCanvasSizes.width / 2,
			y: this.defaultCanvasSizes.height / 2,
		});

		// Reset Ball Speed
		this.setBallVelocity();

		// Reset Paddles Position
		// Body.setPosition(this.topPaddle, {
		// 	x: this.defaultCanvasSizes.width / 2,
		// 	y: 30,
		// });

		// Body.setPosition(this.bottomPaddle, {
		// 	x: this.defaultCanvasSizes.width / 2,
		// 	y: this.defaultCanvasSizes.height - 30,
		// });

		// this.gameGatway.emitToGame(
		// 	this.user1,
		// 	this.user2,
		// 	{},
		// 	'resetDefaultPosition',
		// );
	}

	setBallVelocity() {
		// Random Value Between A Range
		// Math.floor(Math.random() * (max - min + 1)) + min;
		let randomValue: number;

		if (this.mapIndex === 1) randomValue = Math.random() < 0.5 ? -6 : 5;
		else randomValue = Math.random() < 0.5 ? -5 : 5;
		const yVelocity = this.lastDirection == 'top' ? -5 : 5;

		this.currentBallVelocity = {
			x: randomValue,
			y: yVelocity,
		};

		Body.setVelocity(this.ball, {
			x: this.currentBallVelocity.x,
			y: this.currentBallVelocity.y,
		});

		this.gameGatway.emitToGame(
			this.user1,
			this.user2,
			this.ball.velocity,
			'setBallVelocity',
		);
	}

	updateBallVelocity() {
		// Limit Velocity Value
		console.log('Before velocity update:', this.currentBallVelocity.y);
		if (this.currentBallVelocity.y === 10 || this.currentBallVelocity.y === -10)
			return;
		// else if (
		// 	this.currentBallVelocity.y === 8 ||
		// 	this.currentBallVelocity.y === -8
		// )
		// 	return;
		else {
			if (this.lastDirection === 'top') this.currentBallVelocity.y -= 1;
			else this.currentBallVelocity.y += 1;

			Body.setVelocity(this.ball, {
				x: this.ball.velocity.x,
				y: this.currentBallVelocity.y,
			});

			this.gameGatway.emitToGame(
				this.user1,
				this.user2,
				this.ball.velocity,
				'setBallVelocity',
			);
		}
		console.log('After velocity update:', this.currentBallVelocity.y);
	}

	emitScore() {
		if (
			this.ball.position.y < this.topPaddle.position.y ||
			this.ball.position.y > this.bottomPaddle.position.y
		) {
			if (this.ball.position.y < this.topPaddle.position.y) {
				this.playerOneScore++;
				this.lastDirection = 'top';
			} else {
				this.playerTwoScore++;
				this.lastDirection = 'bottom';
			}
			this.gameGatway.emitToUser1InGame(
				this.user1,
				{
					yourScore: this.playerOneScore,
					opponantScore: this.playerTwoScore,
				},
				'updateScore',
			);
			this.gameGatway.emitToUser2InGame(
				this.user2,
				{
					yourScore: this.playerTwoScore,
					opponantScore: this.playerOneScore,
				},
				'updateScore',
			);
			this.resetToDefaultPosition();
		}
	}

	handleDetectCollision() {
		this.handleCollisionStart = (e): void => {
			const pairs = e.pairs[0];

			if (pairs.bodyA === this.topPaddle || pairs.bodyB === this.topPaddle) {
				// this.sound.topPaddleSound.play();
				this.updateBallVelocity();
			} else if (
				pairs.bodyA === this.bottomPaddle ||
				pairs.bodyB === this.bottomPaddle
			) {
				// this.sound.bottomPaddleSound.play();
				this.updateBallVelocity();
			}
		};

		Events.on(this.engine, 'collisionStart', this.handleCollisionStart);

		// this.calcScore();
	}

	calcScore() {
		if (
			this.ball.position.y > this.bottomPaddle.position.y ||
			this.ball.position.y < this.topPaddle.position.y
		)
			this.emitScore();
		if (this.playerOneScore === 7 || this.playerTwoScore === 7) {
			this.gameGatway.endGame(this.game);
		}
	}

	handleClearGame() {
		const displayBodies = (str: string) => {
			console.log(str);
			for (let body of this.engine.world.bodies) console.log(body);
		};

		// displayBodies('before');

		// Remove Basic Bodies In Default Map
		Composite.remove(this.engine.world, this.topPaddle);
		Composite.remove(this.engine.world, this.bottomPaddle);
		Composite.remove(this.engine.world, this.rightRect);
		Composite.remove(this.engine.world, this.leftRect);
		Composite.remove(this.engine.world, this.ball);
		Composite.remove(this.engine.world, this.centerCirle);
		Composite.remove(this.engine.world, this.separator);

		// Remove Obstacles For Map 1 && 2
		if (this.mapIndex === 1) {
			console.log('index 1 chosen');
			Composite.remove(this.engine.world, this.topLeftObstacle);
			Composite.remove(this.engine.world, this.topRightObstacle);
			Composite.remove(this.engine.world, this.bottomLeftObstacle);
			Composite.remove(this.engine.world, this.bottomRightObstacle);
		} else if (this.mapIndex === 2) {
			console.log('index 1 chosen');
			Composite.remove(this.engine.world, this.verticalObstacle1);
			Composite.remove(this.engine.world, this.verticalObstacle2);
			Composite.remove(this.engine.world, this.verticalObstacle3);
			Composite.remove(this.engine.world, this.verticalObstacle4);
		}

		// displayBodies('after');

		Events.off(this.engine, 'collisionStart', this.handleCollisionStart);

		// Clear Intervals:
		clearInterval(this.movePaddleInterval);
		clearInterval(this.updateBallPosition);

		// clearTimeout Of Paddle Game Runner:
		// clearTimeout(this.lunchGameInterval);

		// Stop The Runner:
		// Runner.stop(this.runner);

		// Clear Engine:
		Engine.clear(this.engine);
		World.clear(this.engine.world, false);

		// Close Socket!
		// this.socket.disconnect();
	}
}
