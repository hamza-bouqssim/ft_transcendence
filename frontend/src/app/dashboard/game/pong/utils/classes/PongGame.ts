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
			10,
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

	movePaddle = (): void => {
		// Matter.Events.on(engine, "collisionEnd", () => alert("Tssatho a zpi!"));

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

		const moveInterval = setInterval(() => {
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

		// when a player score a ponit
		// clearInterval(moveInterval);
	};
}

export default PongGame;
