import Ball from "./Ball";
import Paddle from "./Paddle";
import Matter from "matter-js";

const Render = Matter.Render;
const Engine = Matter.Engine;
const Runner = Matter.Runner;
const Composite = Matter.Composite;
const engine = Engine.create({
	gravity: {
		x: 0,
		y: 0,
		scale: 0.001,
	},
});

class PongGame {
	private isPaused: boolean = false;
	private isSilenced: boolean = false;
	private ball: Ball;
	private topPaddle: Paddle;
	private bottomPaddle: Paddle;
	private moveInterval: any;

	constructor(private canvas: HTMLCanvasElement) {
		// Ball Data
		this.ball = new Ball(canvas.width / 2, canvas.height / 2, 15, "#FFF");

		//Paddles Data
		this.topPaddle = new Paddle(canvas.width / 2, 30, 200, 8, "#4FD6FF");

		this.bottomPaddle = new Paddle(
			canvas.width / 2,
			canvas.height - 30,
			200,
			8,
			"#FF5269",
		);

		const render = Render.create({
			canvas: canvas,
			engine: engine,
			context: canvas.getContext("2d")!,
			options: {
				background: "#3A3561",
				wireframes: false,
			},
		});

		//Draw Objects:
		this.ball.draw();
		this.topPaddle.draw();
		this.bottomPaddle.draw();

		const topRect = Matter.Bodies.rectangle(
			canvas.width / 2,
			0,
			canvas.width,
			20,
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
			20,
			canvas.height,
			{
				render: {
					fillStyle: "yellow",
				},
				isStatic: true,
			},
		);

		const bottomRect = Matter.Bodies.rectangle(
			canvas.width / 2,
			canvas.height,
			canvas.width,
			20,
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
			20,
			canvas.height,
			{
				render: {
					fillStyle: "red",
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
			topRect,
			bottomRect,
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
		let movingRight = false;
		let movingLeft = false;

		document.addEventListener("keydown", (e) => {
			if (e.key === "d" || e.key === "ArrowRight") movingRight = true;
			else if (e.key === "a" || e.key === "ArrowLeft") movingLeft = true;
		});

		document.addEventListener("keyup", (e) => {
			if (e.key === "d" || e.key === "ArrowRight") movingRight = false;
			else if (e.key === "a" || e.key === "ArrowLeft") movingLeft = false;
		});

		this.moveInterval = setInterval(() => {
			let stepX;

			if (movingLeft) {
				stepX = this.bottomPaddle.body.position.x - 11;
				if (stepX <= this.bottomPaddle.width / 2) {
					stepX = this.bottomPaddle.width / 2;
				}
				Matter.Body.setPosition(this.bottomPaddle.body, {
					x: stepX,
					y: this.bottomPaddle.body.position.y,
				});
			} else if (movingRight) {
				stepX = this.bottomPaddle.body.position.x + 11;
				if (stepX >= this.canvas.width - this.bottomPaddle.width / 2) {
					stepX = this.canvas.width - this.bottomPaddle.width / 2;
				}
				Matter.Body.setPosition(this.bottomPaddle.body, {
					x: stepX,
					y: this.bottomPaddle.body.position.y,
				});
			}
		}, 10);

		// when a player score a point
		// clearInterval(moveInterval);
	};

	moveBotPaddle = () => {
		let currentPositionX;

		// Matter.Events.on(engine, "collisionStart", (e) => {
		// 	this.ball.body.velocity.x = -this.ball.body.velocity.x;
		// 	this.ball.body.velocity.y = -this.ball.body.velocity.y;

		// 	if (Math.random() < 0.5) this.ball.body.velocity.x *= -1;
		// 	if (Math.random() < 0.5) this.ball.body.velocity.y *= -1;
		// });

		Matter.Events.on(engine, "beforeUpdate", () => {
			currentPositionX = this.ball.body.position.x;

			// if (
			// 	this.ball.body.position.x <
			// 	this.leftPaddle.body.position.x - this.leftPaddle.width / 2
			// 	this.ball.body.position.x >=
			// 		this.rightPaddle.body.position.x + this.rightPaddle.width / 2
			// )
			// 	this.resetObjsDefaultPosition();
			if (
				this.topPaddle.body.position.x + this.topPaddle.width / 2 >=
					this.canvas.width &&
				this.ball.body.position.x >=
					this.canvas.width - this.topPaddle.width / 2
			)
				currentPositionX = this.canvas.width - this.topPaddle.width / 2;
			else if (
				this.topPaddle.body.position.x - this.topPaddle.width / 2 <= 0 &&
				this.ball.body.position.x <= this.topPaddle.width / 2
			)
				currentPositionX = this.topPaddle.width / 2;

			Matter.Body.setPosition(this.topPaddle.body, {
				x: currentPositionX,
				y: this.topPaddle.body.position.y,
			});
		});
	};

	// resetObjsDefaultPosition = (): void => {
	// 	// alert("hi");
	// 	Matter.Body.setPosition(this.ball.body, {
	// 		x: this.ball.xCord,
	// 		y: this.ball.yCord,
	// 	});

	// 	Matter.Body.setPosition(this.rightPaddle.body, {
	// 		x: this.rightPaddle.xCord,
	// 		y: this.rightPaddle.yCord,
	// 	});

	// 	// Matter.Body.setPosition(this.leftPaddle.body, {
	// 	// 	x: this.leftPaddle.xCord,
	// 	// 	y: this.leftPaddle.yCord,
	// 	// });
	// 	// alert(this.moveInterval);
	// 	// clearInterval(this.moveInterval);
	// };

	// isCollidedLeft = (): boolean => {
	// 	if (
	// 		this.ball.body.position.x - this.ball.body.circleRadius <=
	// 			this.leftPaddle.body.position.x + this.leftPaddle.width / 2 &&
	// 		this.ball.body.position.y >=
	// 			this.leftPaddle.body.position.y - this.leftPaddle.height / 2 &&
	// 		this.ball.body.position.y <=
	// 			this.leftPaddle.body.position.y + this.leftPaddle.height / 2
	// 	)
	// 		return true;
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
	// 	)
	// 		return true;
	// 	return false;
	// };

	// checkBallHit = (): void => {
	// 	if (this.isCollidedLeft() || this.isCollidedRight()) {
	// 		Matter.Body.setVelocity(this.ball.body, {
	// 			x: -this.ball.body.velocity.x,
	// 			y: this.ball.body.velocity.y,
	// 		});
	// 	}
	// };
}

export default PongGame;
