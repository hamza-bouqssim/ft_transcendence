import Matter from "matter-js";
import Paddle from "./Paddle";
import Ball from "./Ball";

let Engine: any,
	Render: any,
	Runner: any,
	Bodies: any,
	Composite: any,
	world: any,
	engine: any,
	render: any;

class Pong {
	canvas: HTMLCanvasElement;
	right: Paddle;
	left: Paddle;
	ball: Ball;
	paused: boolean;

	constructor(
		canvas: HTMLCanvasElement,
		right: Paddle,
		left: Paddle,
		ball: Ball,
		paused: boolean,
	) {
		this.canvas = canvas;
		this.right = right;
		this.left = left;
		this.ball = ball;
		this.paused = paused;
	}

	init = (): void => {
		(Engine = Matter.Engine),
			(Render = Matter.Render),
			(Runner = Matter.Runner),
			(Bodies = Matter.Bodies),
			(Composite = Matter.Composite),
			(engine = Engine.create()),
			(world = engine.world),
			(render = Render.create({
				canvas: this.canvas,
				engine: engine,
				context: this.canvas.getContext("2d"),
				options: {
					background: "#3A3561",
					wireframes: false,
				},
			}));
	};

	draw = (): void => {
		this.right.drawPaddle();
		this.left.drawPaddle();
		this.ball.drawBall();
	};

	start = (): void => {
		let runner = Runner.create();

		Composite.add(world, [this.right.body, this.left.body, this.ball.body]);

		Render.run(render);

		this.left.move(render, this.ball);

		setTimeout(() => {
			if (this.paused) return;
			Runner.run(runner, engine);

			// Add a listener to update the ball's velocity
			Matter.Events.on(engine, "beforeUpdate", () => {
				this.ball.checkBallHit(this.left, this.right);
				this.ball.autoMove(render, this.left, this.right);
				this.right.move(render, this.ball);

				Matter.Body.setVelocity(this.ball.body, {
					x: this.ball.xVelocity * this.ball.speed,
					y: this.ball.yVelocity * this.ball.speed,
				});
			});
		}, 1000);
	};
}

export default Pong;
