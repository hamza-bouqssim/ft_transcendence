import { Howl } from "howler";
import {
	Bodies,
	Body,
	Composite,
	Engine,
	Events,
	Render,
	Runner,
	World,
} from "matter-js";

const engine = Engine.create({
	gravity: {
		x: 0,
		y: 0,
	},
});

const runner: any = Runner.create();

class PongGame {
	private ball: any;
	private topPaddle: any;
	private bottomPaddle: any;
	private rightRect: any;
	private leftRect: any;
	private centerCirle: any;
	private separator: any;
	private divWidth: number;
	private divHeight: number;
	private maxBallSpeed: number = 10;
	private currentBallSpeed: any = {
		x: 0,
		y: 0,
	};
	private moveInterval: any;
	// private lunchGameInterval: any;
	private updatePositionInterval: any;
	private handleKeyDown = (e: KeyboardEvent): void => {};
	private handleKeyUp = (e: KeyboardEvent): void => {};
	private handleCollisionStart = (e: any): void => {};
	private handleBeforeUpdate = (): void => {};
	private handleSetVelocity = (data: any) => {
		Body.setVelocity(this.ball, {
			x: this.map(data.x, this.defaultCanvasSizes.width, this.divWidth),
			y: this.map(data.y, this.defaultCanvasSizes.height, this.divHeight),
		});
	};
	private handleSetPosition = (data: any) => {
		Body.setPosition(this.ball, {
			x: this.map(data.x, this.defaultCanvasSizes.width, this.divWidth),
			y: this.map(data.y, this.defaultCanvasSizes.height, this.divHeight),
		});
	};
	private defaultCanvasSizes: any = {
		width: 560,
		height: 836,
	};
	private paddleSizes: any = {
		width: 170,
		height: 15,
	};
	private map = (
		inputSize: number,
		defaultCanvasSize: number,
		currentCanvasSize: number,
	): number => {
		return (inputSize * currentCanvasSize) / defaultCanvasSize;
	};
	private render: any;
	playerScore: number = 0;
	botScore: number = 0;
	private sound = {
		topPaddleSound: new Howl({
			src: ["/assets/sounds/leftPaddle.mp3"],
		}),
		bottomPaddleSound: new Howl({
			src: ["/assets/sounds/rightPaddle.mp3"],
		}),
		win: new Howl({
			src: ["/assets/sounds/winSound.mp3"],
		}),
	};

	constructor(
		private parentDiv: HTMLDivElement,
		private chosenMapIndex: number,
		private display_name?: string,
		private socket?: any,
	) {
		this.divWidth = this.parentDiv.getBoundingClientRect().width;
		this.divHeight = this.parentDiv.getBoundingClientRect().height;

		// Update Paddles && ball Size With New Mapped Values:
		this.paddleSizes = {
			width: this.map(
				this.paddleSizes.width,
				this.defaultCanvasSizes.width,
				this.divWidth,
			),
			height: this.map(
				this.paddleSizes.height,
				this.defaultCanvasSizes.height,
				this.divHeight,
			),
		};

		this.currentBallSpeed = {
			x: this.map(
				this.currentBallSpeed.x,
				this.defaultCanvasSizes.width,
				this.divWidth,
			),
			y: this.map(
				this.currentBallSpeed.y,
				this.defaultCanvasSizes.height,
				this.divHeight,
			),
		};

		// This Function Will Run In All Maps:
		this.defaultGameMap();

		switch (this.chosenMapIndex) {
			case 1:
				this.gameWithCircleObstacles();
				break;

			case 2:
				this.gameWithVerticalObstacles();
				break;
		}

		this.render = Render.create({
			element: this.parentDiv,
			engine: engine,
			options: {
				background: "#3A3561",
				width: this.divWidth,
				height: this.divHeight,
				wireframes: false,
			},
		});

		Render.run(this.render);

		if (this.socket) this.moveOnlineModeBall();
		else {
			this.setBotModeBall();
			this.moveBotPaddle();
		}
		this.movePaddle();

		//Run Game
		this.startGame();
	}

	defaultGameMap = (): void => {
		// Create Ball:
		this.ball = Bodies.circle(
			this.divWidth / 2,
			this.divHeight / 2,
			this.map(15, this.defaultCanvasSizes.width, this.divWidth),
			{
				label: "ball",
				render: {
					fillStyle: "#FFF",
				},
				frictionAir: 0,
				friction: 0,
				inertia: Infinity,
				restitution: 1,
			},
		);

		// const topRect = Bodies.rectangle(this.divWidth / 2, 0, this.divWidth, 20, {
		// 	render: {
		// 		fillStyle: "red",
		// 	},
		// 	isStatic: true,
		// });
		// const bottomRect = Bodies.rectangle(
		// 	this.divWidth / 2,
		// 	this.divHeight,
		// 	this.divWidth,
		// 	20,
		// 	{
		// 		render: {
		// 			fillStyle: "yellow",
		// 		},
		// 		isStatic: true,
		// 	},
		// );

		// Create Two Paddles:
		this.topPaddle = Bodies.rectangle(
			this.divWidth / 2,
			this.map(30, this.defaultCanvasSizes.height, this.divHeight),
			this.paddleSizes.width,
			this.paddleSizes.height,
			{
				label: "topPaddle",
				render: {
					fillStyle: "#4FD6FF",
				},
				isStatic: true,
				// chamfer: { radius: 10 },
			},
		);

		this.bottomPaddle = Bodies.rectangle(
			this.divWidth / 2,
			this.divHeight -
				this.map(30, this.defaultCanvasSizes.height, this.divHeight),
			this.paddleSizes.width,
			this.paddleSizes.height,
			{
				label: "bottomPaddle",
				render: {
					fillStyle: "#FF5269",
				},
				isStatic: true,
				// chamfer: { radius: 10 },
			},
		);

		// Create Two Boundies:
		this.rightRect = Bodies.rectangle(
			this.divWidth,
			this.divHeight / 2,
			this.map(20, this.defaultCanvasSizes.width, this.divWidth),
			this.divHeight,
			{
				label: "rightRect",
				render: {
					fillStyle: "#CFF4FF",
				},
				isStatic: true,
			},
		);

		this.leftRect = Bodies.rectangle(
			0,
			this.divHeight / 2,
			this.map(20, this.defaultCanvasSizes.width, this.divWidth),
			this.divHeight,
			{
				label: "leftRect",
				render: {
					fillStyle: "#CFF4FF",
				},
				isStatic: true,
			},
		);

		this.separator = Bodies.rectangle(
			this.divWidth / 2,
			this.divHeight / 2,
			this.divWidth,
			this.map(8, this.defaultCanvasSizes.height, this.divHeight),
			{
				isSensor: true,
				render: {
					fillStyle: "#CFF4FF",
				},
			},
		);

		this.centerCirle = Bodies.circle(
			this.divWidth / 2,
			this.divHeight / 2,
			this.map(8, this.defaultCanvasSizes.width, this.divWidth),
			{
				isSensor: true,
				render: {
					fillStyle: "#CFF4FF",
				},
			},
		);

		Composite.add(engine.world, [
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
	};

	gameWithCircleObstacles = (): void => {
		const topLeftObstacle = Bodies.circle(
			this.divWidth / 4,
			this.divHeight / 4,
			this.map(50, this.defaultCanvasSizes.width, this.divWidth),
			{
				isStatic: true,
				render: {
					fillStyle: "white",
				},
			},
		);

		const topRightObstacle = Bodies.circle(
			(3 * this.divWidth) / 4,
			this.divHeight / 4,
			this.map(40, this.defaultCanvasSizes.width, this.divWidth),
			{
				isStatic: true,
				render: {
					fillStyle: "white",
				},
			},
		);

		const bottomRightObstacle = Bodies.circle(
			(3 * this.divWidth) / 4,
			(3 * this.divHeight) / 4,
			this.map(50, this.defaultCanvasSizes.width, this.divWidth),
			{
				isStatic: true,
				render: {
					fillStyle: "white",
				},
			},
		);

		const bottomLeftObstacle = Bodies.circle(
			this.divWidth / 4,
			(3 * this.divHeight) / 4,
			this.map(40, this.defaultCanvasSizes.width, this.divWidth),
			{
				isStatic: true,
				render: {
					fillStyle: "white",
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

	gameWithVerticalObstacles = (): void => {
		const verticalObstacle1 = Bodies.rectangle(
			this.divWidth -
				this.map(65, this.defaultCanvasSizes.width, this.divWidth),
			this.divHeight / 5,
			this.map(15, this.defaultCanvasSizes.width, this.divWidth),
			this.map(170, this.defaultCanvasSizes.height, this.divHeight),
			{
				render: {
					fillStyle: "white",
				},
				isStatic: true,
			},
		);

		const verticalObstacle2 = Bodies.rectangle(
			this.divWidth / 2,
			this.divHeight / 3,
			this.map(15, this.defaultCanvasSizes.width, this.divWidth),
			this.map(100, this.defaultCanvasSizes.height, this.divHeight),
			{
				render: {
					fillStyle: "white",
				},
				isStatic: true,
			},
		);

		const verticalObstacle3 = Bodies.rectangle(
			this.map(65, this.defaultCanvasSizes.width, this.divWidth),
			(2 * this.divHeight) / 3,
			this.map(15, this.defaultCanvasSizes.width, this.divWidth),
			this.map(170, this.defaultCanvasSizes.height, this.divHeight),
			{
				render: {
					fillStyle: "white",
				},
				isStatic: true,
			},
		);

		const verticalObstacle4 = Bodies.rectangle(
			this.divWidth -
				this.map(65, this.defaultCanvasSizes.width, this.divWidth),
			(4 * this.divHeight) / 5,
			this.map(15, this.defaultCanvasSizes.width, this.divWidth),
			this.map(170, this.defaultCanvasSizes.height, this.divHeight),
			{
				render: {
					fillStyle: "white",
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

	startGame = (): void => {
		// this.lunchGameInterval = setTimeout((): void => {
		// run the engine
		Runner.run(runner, engine);
		// }, 1000);
	};

	moveOnlineModeBall = (): void => {
		//  this.socket.on("setBallVelocity", (data: any) => {
		// 	Body.setVelocity(this.ball, {
		// 		x: this.map(data.x, this.defaultCanvasSizes.width, this.divWidth),
		// 		y: this.map(data.y, this.defaultCanvasSizes.height, this.divHeight),
		// 	});
		// });
		// this.socket.on("updateBallPosition", (data: any) => {
		// 	Body.setPosition(this.ball, {
		// 		x: this.map(data.x, this.defaultCanvasSizes.width, this.divWidth),
		// 		y: this.map(data.y, this.defaultCanvasSizes.height, this.divHeight),
		// 	});
		// });

		this.socket.on("setBallVelocity", this.handleSetVelocity);
		this.socket.on("updateBallPosition", this.handleSetPosition);
	};

	setBotModeBall = (): void => {
		this.currentBallSpeed = {
			x: 4,
			y: 4,
		};

		Body.setVelocity(this.ball, {
			x: this.currentBallSpeed.x,
			y: this.currentBallSpeed.y,
		});
	};

	movePaddle = (): void => {
		if (this.socket) {
			document.addEventListener("keydown", (e) => {
				if (e.key === "d" || e.key === "ArrowRight")
					this.socket.emit("keyevent", {
						display_name: this.display_name,
						key: e.key,
						state: "keydown",
					});
				else if (e.key === "a" || e.key === "ArrowLeft")
					this.socket.emit("keyevent", {
						display_name: this.display_name,
						key: e.key,
						state: "keydown",
					});
			});

			document.addEventListener("keyup", (e) => {
				if (e.key === "d" || e.key === "ArrowRight")
					this.socket.emit("keyevent", {
						display_name: this.display_name,
						key: e.key,
						state: "keyup",
					});
				else if (e.key === "a" || e.key === "ArrowLeft")
					this.socket.emit("keyevent", {
						display_name: this.display_name,
						key: e.key,
						state: "keyup",
					});
			});
			this.socket.on("updatePaddlePosition", (data: any) => {
				Body.setPosition(this.bottomPaddle, {
					x: this.map(
						data.xPosition1,
						this.defaultCanvasSizes.width,
						this.divWidth,
					),
					y: this.bottomPaddle.position.y,
				});
				Body.setPosition(this.topPaddle, {
					x: this.map(
						data.xPosition2,
						this.defaultCanvasSizes.width,
						this.divWidth,
					),
					y: this.topPaddle.position.y,
				});
			});
		} else {
			let movingRight = false;
			let movingLeft = false;

			this.handleKeyDown = (e: KeyboardEvent): void => {
				if (e.key === "d" || e.key === "ArrowRight") movingRight = true;
				else if (e.key === "a" || e.key === "ArrowLeft") movingLeft = true;
			};

			this.handleKeyUp = (e: KeyboardEvent): void => {
				if (e.key === "d" || e.key === "ArrowRight") movingRight = false;
				else if (e.key === "a" || e.key === "ArrowLeft") movingLeft = false;
			};

			document.addEventListener("keydown", this.handleKeyDown);

			document.addEventListener("keyup", this.handleKeyUp);

			this.moveInterval = setInterval(() => {
				let stepX;

				if (movingLeft) {
					stepX =
						this.bottomPaddle.position.x -
						this.map(11, this.defaultCanvasSizes.width, this.divWidth);
					if (stepX <= this.paddleSizes.width / 2) {
						stepX = this.paddleSizes.width / 2;
					}
					Body.setPosition(this.bottomPaddle, {
						x: stepX,
						y: this.bottomPaddle.position.y,
					});
				} else if (movingRight) {
					stepX =
						this.bottomPaddle.position.x +
						this.map(11, this.defaultCanvasSizes.width, this.divWidth);
					if (stepX >= this.divWidth - this.paddleSizes.width / 2) {
						stepX = this.divWidth - this.paddleSizes.width / 2;
					}
					Body.setPosition(this.bottomPaddle, {
						x: stepX,
						y: this.bottomPaddle.position.y,
					});
				}
			}, 10);
		}
	};

	resetToDefaultPosition() {
		// Reset Ball Position
		Body.setPosition(this.ball, {
			x: this.divWidth / 2,
			y: this.divHeight / 2,
		});

		// Reset Ball Speed
		this.setBotModeBall();

		// Reset Paddles Position
		Body.setPosition(this.bottomPaddle, {
			x: this.divWidth / 2,
			y:
				this.divHeight -
				this.map(30, this.defaultCanvasSizes.height, this.divHeight),
		});
	}

	setBallSpeed = (): void => {
		// this.currentBallSpeed = {
		// 	x: (this.currentBallSpeed.x += 0.5),
		// 	y: (this.currentBallSpeed.y += 0.5),
		// };

		// Body.setVelocity(this.ball, {
		// 	x: 10,
		// 	y: 10,
		// });

		// Limit the ball's speed
		if (
			this.currentBallSpeed.x < this.maxBallSpeed &&
			this.currentBallSpeed.y < this.maxBallSpeed
		)
			Body.setVelocity(this.ball, {
				x: this.ball.velocity.x,
				y: (this.currentBallSpeed.y += this.map(
					0.5,
					this.defaultCanvasSizes.height,
					this.divHeight,
				)),
			});
	};

	moveBotPaddle = (): void => {
		// Update random position after 3 seconds
		this.updatePositionInterval = setInterval(() => {
			let currentPositionX =
				Math.floor(
					Math.random() * (this.divWidth - this.paddleSizes.width) +
						this.paddleSizes.width / 2,
				) + this.currentBallSpeed.x;

			if (currentPositionX > this.divWidth - this.paddleSizes.width / 2)
				currentPositionX = this.divWidth - this.paddleSizes.width / 2;
			else if (currentPositionX < this.paddleSizes.width / 2)
				currentPositionX = this.paddleSizes.width / 2;

			Body.setPosition(this.topPaddle, {
				x: currentPositionX,
				y: this.topPaddle.position.y,
			});
		}, 100);

		this.handleCollisionStart = (e: any): void => {
			const pairs = e.pairs[0];

			if (pairs.bodyA === this.topPaddle || pairs.bodyB === this.topPaddle) {
				this.sound.topPaddleSound.play();
				this.setBallSpeed();
			} else if (
				pairs.bodyA === this.bottomPaddle ||
				pairs.bodyB === this.bottomPaddle
			) {
				this.sound.bottomPaddleSound.play();
				this.setBallSpeed();
			}
		};

		Events.on(engine, "collisionStart", this.handleCollisionStart);
		this.calcScore();

		// Matter.Events.on(engine, "collisionStart", (e) => {
		// 	this.ball.body.velocity.x = -this.ball.body.velocity.x;
		// 	this.ball.body.velocity.y = -this.ball.body.velocity.y;

		// 	if (Math.random() < 0.5) this.ball.body.velocity.x *= -1;
		// 	if (Math.random() < 0.5) this.ball.body.velocity.y *= -1;
		// });
	};

	calcScore = (): void => {
		this.handleBeforeUpdate = () => {
			if (
				this.ball.position.y > this.bottomPaddle.position.y ||
				this.ball.position.y < this.topPaddle.position.y
			) {
				this.ball.position.y > this.bottomPaddle.position.y
					? this.botScore++
					: this.playerScore++;
				this.sound.win.play();
				this.resetToDefaultPosition();
			}
		};

		Events.on(engine, "beforeUpdate", this.handleBeforeUpdate);
	};

	clear = (): void => {
		// const displayBodies = (str: string) => {
		// 	console.log(str);
		// 	for (let body of engine.world.bodies) console.log(body);
		// };

		// displayBodies("before");

		Composite.remove(engine.world, this.topPaddle);
		Composite.remove(engine.world, this.bottomPaddle);
		Composite.remove(engine.world, this.rightRect);
		Composite.remove(engine.world, this.leftRect);
		Composite.remove(engine.world, this.ball);
		Composite.remove(engine.world, this.centerCirle);
		Composite.remove(engine.world, this.separator);

		// displayBodies("after");

		// Remove Events:
		Events.off(engine, "collisionStart", this.handleCollisionStart);
		Events.off(engine, "beforeUpdate", this.handleBeforeUpdate);

		// clearTimeout Of Paddle Game Runner:
		// clearTimeout(this.lunchGameInterval);
		clearInterval(this.updatePositionInterval);

		// Stop The Runner:
		Runner.stop(runner);

		this.render.canvas?.remove();
		this.render.canvas = null;
		this.render.context = null;
		this.render.textures = {};

		// Stop The Render:
		Render.stop(this.render);

		// Clear Engine:
		Engine.clear(engine);
		World.clear(engine.world, false);

		// Remove Listeners:
		document.removeEventListener("keydown", this.handleKeyDown);
		document.removeEventListener("keyup", this.handleKeyUp);

		// Close Socket!
		if (this.socket) {
			this.socket.off("setBallVelocity", this.handleSetVelocity);
			this.socket.off("updateBallPosition", this.handleSetPosition);
			clearInterval(this.moveInterval);
			this.socket.disconnect();
		}
	};
}

export default PongGame;
