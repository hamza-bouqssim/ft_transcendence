import Ball from "./Ball";
import Paddle from "./Paddle";
import Matter from "matter-js";

const Render = Matter.Render;
const Engine = Matter.Engine;
const Runner = Matter.Runner;
const Composite = Matter.Composite;
const engine = Engine.create();

class PongGame {
	private isPaused: boolean = false;
	private isSilenced: boolean = false;
	private ball: Ball;
	private rightPaddle: Paddle;
	private leftPaddle: Paddle;
	private moveInterval: any;

	constructor(private canvas: HTMLCanvasElement) {
		// Ball Data
		this.ball = new Ball(canvas.width / 2, canvas.height / 2, 15, "#FFF");

		//Paddles Data
		this.rightPaddle = new Paddle(
			canvas.width - 50,
			canvas.height / 2,
			10,
			150,
			"#4FD6FF",
		);

		this.leftPaddle = new Paddle(50, canvas.height / 2, 10, 150, "#FF5269");

		const render = Render.create({
			canvas: canvas,
			engine: engine,
			context: canvas.getContext("2d")!,
			options: {
				background: "#3A3561",
				wireframes: false,
			},
		});

		// engine.options.collisionSteps = 10;

		//Draw Objects:
		this.ball.draw();
		this.rightPaddle.draw();
		this.leftPaddle.draw();

		const topRect = Matter.Bodies.rectangle(
			canvas.width / 2,
			0,
			canvas.width,
			10,
			{
				render: {
					fillStyle: "red",
				},
				isStatic: true,
			},
		);

		const rightRect = Matter.Bodies.rectangle(
			canvas.width,
			canvas.height / 2,
			10,
			canvas.height,
			{
				render: {
					fillStyle: "green",
				},
				isStatic: true,
			},
		);

		const bottomRect = Matter.Bodies.rectangle(
			canvas.width / 2,
			canvas.height,
			canvas.width,
			15,
			{
				render: {
					fillStyle: "yellow",
				},
				isStatic: true,
			},
		);

		const leftRect = Matter.Bodies.rectangle(
			0,
			canvas.height / 2,
			10,
			canvas.height,
			{
				render: {
					fillStyle: "blue",
				},
				isStatic: true,
			},
		);

		Composite.add(engine.world, [
			this.ball.body,
			this.rightPaddle.body,
			this.leftPaddle.body,
			topRect,
			rightRect,
			bottomRect,
			leftRect,
		]);

		Render.run(render);

		// create runner
		var runner = Runner.create();

		// run the engine
		Runner.run(runner, engine);
	}

	moveBall = () => {
		// if (this.ball.body.position.y + this.ball.radius >= this.canvas.height) {
		// 	Matter.Body.setPosition(this.ball.body, {
		// 		x: this.ball.body.position.x,
		// 		y: this.canvas.height - this.ball.radius,
		// 	});
		// 	Matter.Body.setVelocity(this.ball.body, {
		// 		x: -this.ball.body.velocity.x,
		// 		y: -this.ball.body.velocity.y,
		// 	});
		// }
		// if (this.ball.body.position.y - this.ball.radius <= 0) {
		// 	Matter.Body.setPosition(this.ball.body, {
		// 		x: this.ball.body.position.x,
		// 		y: this.ball.radius,
		// 	});
		// 	Matter.Body.setVelocity(this.ball.body, {
		// 		x: -this.ball.body.velocity.x,
		// 		y: -this.ball.body.velocity.y,
		// 	});
		// }
		this.ball.setBallSpeed();
	};

	movePaddle = (): void => {
		let movingUp = false;
		let movingDown = false;

		document.addEventListener("keydown", (e) => {
			if (e.key === "w") movingUp = true;
			else if (e.key === "s") movingDown = true;
		});

		document.addEventListener("keyup", (e) => {
			if (e.key === "w") movingUp = false;
			else if (e.key === "s") movingDown = false;
		});

		this.moveInterval = setInterval(() => {
			let stepY;
			if (movingUp) {
				stepY = this.leftPaddle.body.position.y - 3;
				if (stepY <= this.leftPaddle.height / 2) {
					stepY = this.leftPaddle.height / 2;
				}
				Matter.Body.setPosition(this.leftPaddle.body, {
					x: this.leftPaddle.body.position.x,
					y: stepY,
				});
			} else if (movingDown) {
				stepY = this.leftPaddle.body.position.y + 3;
				if (stepY >= this.canvas.height - this.leftPaddle.height / 2) {
					stepY = this.canvas.height - this.leftPaddle.height / 2;
				}
				Matter.Body.setPosition(this.leftPaddle.body, {
					x: this.leftPaddle.body.position.x,
					y: stepY,
				});
			}
		}, 10);

		// when a player score a point
		// clearInterval(moveInterval);
	};

	moveBotPaddle = () => {
		let currentPositionY;

		Matter.Events.on(engine, "collisionStart", (e) => {
			this.ball.body.velocity.x = -this.ball.body.velocity.x;
			this.ball.body.velocity.y = -this.ball.body.velocity.y;

			if (Math.random() < 0.5) this.ball.body.velocity.x *= -1;
			if (Math.random() < 0.5) this.ball.body.velocity.y *= -1;
		});

		Matter.Events.on(engine, "beforeUpdate", () => {
			// this.moveBall();
			// this.checkBallHit();
			// this.ball.setBallSpeed();

			currentPositionY = this.ball.body.position.y;

			// if (
			// 	this.ball.body.position.x <
			// 	this.leftPaddle.body.position.x - this.leftPaddle.width / 2
			// 	this.ball.body.position.x >=
			// 		this.rightPaddle.body.position.x + this.rightPaddle.width / 2
			// )
			// 	this.resetObjsDefaultPosition();
			if (
				this.rightPaddle.body.position.y - this.rightPaddle.height / 2 <= 0 &&
				this.ball.body.position.y <= this.rightPaddle.height / 2
			)
				currentPositionY = this.rightPaddle.height / 2;
			else if (
				this.rightPaddle.body.position.y + this.rightPaddle.height / 2 >=
					this.canvas.height &&
				this.ball.body.position.y >=
					this.canvas.height - this.rightPaddle.height / 2
			)
				currentPositionY = this.canvas.height - this.rightPaddle.height / 2;

			Matter.Body.setPosition(this.rightPaddle.body, {
				x: this.rightPaddle.body.position.x,
				y: currentPositionY,
			});
			const canvasWidth = this.canvas.width;
			const canvasHeight = this.canvas.height;
			const ball = this.ball.body;

			// Update the ball's position and velocity based on the canvas boundaries
			if (ball.position.x - this.ball.radius < 0) {
				ball.position.x = this.ball.radius;
				ball.velocity.x *= -1;
			} else if (ball.position.x + this.ball.radius > canvasWidth) {
				ball.position.x = canvasWidth - this.ball.radius;
				ball.velocity.x *= -1;
			}

			if (ball.position.y - this.ball.radius < 0) {
				ball.position.y = this.ball.radius;
				ball.velocity.y *= -1;
			} else if (ball.position.y + this.ball.radius > canvasHeight) {
				ball.position.y = canvasHeight - this.ball.radius;
				ball.velocity.y *= -1;
			}
		});
	};

	resetObjsDefaultPosition = (): void => {
		// alert("hi");
		Matter.Body.setPosition(this.ball.body, {
			x: this.ball.xCord,
			y: this.ball.yCord,
		});

		Matter.Body.setPosition(this.rightPaddle.body, {
			x: this.rightPaddle.xCord,
			y: this.rightPaddle.yCord,
		});

		// Matter.Body.setPosition(this.leftPaddle.body, {
		// 	x: this.leftPaddle.xCord,
		// 	y: this.leftPaddle.yCord,
		// });
		// alert(this.moveInterval);
		// clearInterval(this.moveInterval);
	};

	isCollidedLeft = (): boolean => {
		if (
			this.ball.body.position.x - this.ball.body.circleRadius <=
				this.leftPaddle.body.position.x + this.leftPaddle.width / 2 &&
			this.ball.body.position.y >=
				this.leftPaddle.body.position.y - this.leftPaddle.height / 2 &&
			this.ball.body.position.y <=
				this.leftPaddle.body.position.y + this.leftPaddle.height / 2
		)
			return true;
		return false;
	};

	isCollidedRight = (): boolean => {
		if (
			this.ball.body.position.x + this.ball.body.circleRadius >=
				this.rightPaddle.body.position.x - this.rightPaddle.width / 2 &&
			this.ball.body.position.y >=
				this.rightPaddle.body.position.y - this.rightPaddle.height / 2 &&
			this.ball.body.position.y <=
				this.rightPaddle.body.position.y + this.rightPaddle.height / 2
		)
			return true;
		return false;
	};

	checkBallHit = (): void => {
		if (this.isCollidedLeft() || this.isCollidedRight()) {
			Matter.Body.setVelocity(this.ball.body, {
				x: -this.ball.body.velocity.x,
				y: this.ball.body.velocity.y,
			});
		}
	};
}

export default PongGame;
