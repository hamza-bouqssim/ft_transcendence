import Matter from "matter-js";
import Ball from "./Ball";

class Paddle {
	xCord: number;
	yCord: number;
	resetX: number;
	resetY: number;
	width: number;
	height: number;
	color: string;
	body: any;
	currentRightPaddlePos: number;

	constructor(
		xCord: number,
		yCord: number,
		width: number,
		height: number,
		color: string,
	) {
		this.xCord = xCord;
		this.yCord = yCord;
		this.resetX = this.xCord;
		this.resetY = this.yCord;
		this.width = width;
		this.height = height;
		this.color = color;
		this.currentRightPaddlePos = this.yCord;
	}

	drawPaddle = (): void => {
		this.body = Matter.Bodies.rectangle(
			this.xCord,
			this.yCord,
			this.width,
			this.height,
			{
				render: {
					fillStyle: this.color,
				},
				isStatic: true,
			},
		);
	};

	currentRightPaddlePosition = (render: any, ball: Ball): void => {
		if (
			this.body.position.y + this.height / 2 >= render.canvas.height &&
			ball.body.position.y >= render.canvas.height - this.height / 2
		)
			this.currentRightPaddlePos = render.canvas.height - this.height / 2;
		else if (
			this.body.position.y - this.height / 2 <= 0 &&
			ball.body.position.y <= this.height / 2
		)
			this.currentRightPaddlePos = this.height / 2;
		else this.currentRightPaddlePos = ball.body.position.y;

		Matter.Body.setPosition(this.body, {
			x: this.body.position.x,
			y: this.currentRightPaddlePos,
		});
	};

	applyMoving = (render: any, steps: any, key: any): void => {
		if (this.body.position.y <= this.height / 2 && key == "w")
			this.yCord = this.height / 2;
		else if (
			this.body.position.y + this.height / 2 >= render.canvas.height &&
			key == "s"
		)
			this.yCord = render.canvas.height - this.height / 2;
		else this.yCord += steps;

		Matter.Body.setPosition(this.body, {
			x: this.xCord,
			y: this.yCord,
		});
	};

	move = (render: any, ball: Ball): void => {
		if (this.xCord < render.canvas.width / 2) {
			document.addEventListener("keydown", (e) => {
				if (e.key === "w") this.applyMoving(render, -15, e.key);
				else if (e.key === "s") this.applyMoving(render, 15, e.key);
			});
		}
		if (this.xCord > render.canvas.width / 2)
			this.currentRightPaddlePosition(render, ball);
	};

	reset = (): void => {
		Matter.Body.setPosition(this.body, {
			x: this.resetX,
			y: this.resetY,
		});
	};
}

export default Paddle;
