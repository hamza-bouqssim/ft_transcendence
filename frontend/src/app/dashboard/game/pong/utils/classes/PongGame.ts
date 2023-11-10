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
	},
});

class PongGame {
	private isPaused: boolean = false;
	private isSilenced: boolean = false;
	private ball: Ball;
	private topPaddle: Paddle;
	private bottomPaddle: Paddle;
	private divWidth;
	private divHeight;
	private moveInterval: any;

	constructor(private parentDiv: HTMLDivElement) {
		this.divWidth = parentDiv.getBoundingClientRect().width;
		this.divHeight = parentDiv.getBoundingClientRect().height;

		// Ball Data
		this.ball = new Ball(this.divWidth / 2, this.divHeight / 2, 15, "#FFF");

		//Paddles Data
		this.topPaddle = new Paddle(this.divWidth / 2, 30, 170, 15, "#4FD6FF");

		this.bottomPaddle = new Paddle(
			this.divWidth / 2,
			this.divHeight - 30,
			170,
			15,
			"#FF5269",
		);

		const render = Render.create({
			element: parentDiv,
			engine: engine,
			options: {
				background: "#3A3561",
				width: this.divWidth,
				height: this.divHeight,
				wireframes: false,
			},
		});

		//Draw Objects:
		this.ball.draw();
		this.topPaddle.draw();
		this.bottomPaddle.draw();

		const topRect = Matter.Bodies.rectangle(
			this.divWidth / 2,
			0,
			this.divWidth,
			20,
			{
				render: {
					fillStyle: "red",
				},
				isStatic: true,
			},
		);

		const rightRect = Matter.Bodies.rectangle(
			this.divWidth,
			this.divHeight / 2,
			20,
			this.divHeight,
			{
				render: {
					fillStyle: "#CFF4FF",
				},
				isStatic: true,
			},
		);

		const bottomRect = Matter.Bodies.rectangle(
			this.divWidth / 2,
			this.divHeight,
			this.divWidth,
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
			this.divHeight / 2,
			20,
			this.divHeight,
			{
				render: {
					fillStyle: "#CFF4FF",
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

		Render.run(render);

		// create runner
		var runner = Runner.create();

		// run the engine
		Runner.run(runner, engine);
	}

	resetObjsDefaultPosition = (): void => {
		Matter.Body.setPosition(this.ball.body, {
			x: this.ball.xCord,
			y: this.ball.yCord,
		});
		// clearInterval(this.moveInterval);
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
				if (stepX >= this.divWidth - this.bottomPaddle.width / 2) {
					stepX = this.divWidth - this.bottomPaddle.width / 2;
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
			// 	this.ball.body.position.y <
			// 		this.bottomPaddle.body.position.y - this.bottomPaddle.height / 2 ||
			// 	this.ball.body.position.y >=
			// 		this.topPaddle.body.position.y + this.topPaddle.height / 2
			// )
			if (
				this.ball.body.position.y >=
				this.bottomPaddle.body.position.y + this.bottomPaddle.height / 2
			)
				this.resetObjsDefaultPosition();
			else if (
				this.topPaddle.body.position.x + this.topPaddle.width / 2 >=
					this.divWidth &&
				this.ball.body.position.x >= this.divWidth - this.topPaddle.width / 2
			)
				currentPositionX = this.divWidth - this.topPaddle.width / 2;
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
}

export default PongGame;
