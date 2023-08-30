import Matter from "matter-js";
import { Howl, Howler } from "howler";
import Paddle from "./Paddle";

const Bodies = Matter.Bodies;


class Ball {
	xCord: number;
	yCord: number;
	radius: number;
	color: string;
	body: any;
	xVelocity: number = -1;
	yVelocity: number = -1;
	speed: number = 3;
	sound = {
		leftPaddleSound: new Howl({
			src: ["/assets/sounds/leftPaddle.wav"],
		}),
		rightPaddleSound: new Howl({
			src: ["/assets/sounds/rightPaddle.wav"],
		}),
	};

	constructor(xCord: number, yCord: number, radius: number, color: string) {
		this.xCord = xCord;
		this.yCord = yCord;
		this.radius = radius;
		this.color = color;
	}

	drawBall = (): void => {
		this.body = Bodies.circle(this.xCord, this.yCord, this.radius, {
			render: {
				fillStyle: "white",
			},
		});
	};

	reset = (): void => {
		Matter.Body.setPosition(this.body, {
			x: this.xCord,
			y: this.yCord,
		});
	};

	// If the ball reaches the canvas boundary, reverse its vertical velocity
	autoMove = (render: any, left: Paddle, right: Paddle): void => {
		// if (
		// 	this.body.position.y + this.body.circleRadius >= render.canvas.height ||
		// 	this.body.position.y - this.body.circleRadius <= 0
		// ) {
		// 	this.yVelocity = -this.yVelocity;
		// 	return this.yVelocity;
		// }
		if (
			this.body.position.y + this.body.circleRadius >= render.canvas.height ||
			this.body.position.y - this.body.circleRadius <= 0
		)
			this.yVelocity = -this.yVelocity;

		if (
			this.body.position.x > render.canvas.width ||
			this.body.position.x < 0
		) {
			this.reset();
			left.reset();
			right.reset();
		}
	};
	// dlete two this methods and make just one is better
	isCollidedLeft = (left: Paddle): boolean => {
		if (
			this.body.position.x - this.body.circleRadius <=
				left.body.position.x + left.width / 2 &&
			this.body.position.y >= left.body.position.y - left.height / 2 &&
			this.body.position.y <= left.body.position.y + left.height / 2
		) {
			this.sound.leftPaddleSound.play();
			return true;
		}
		return false;
	};

	isCollidedRight = (right: Paddle): boolean => {
		if (
			this.body.position.x + this.body.circleRadius >=
				right.body.position.x - right.width / 2 &&
			this.body.position.y >= right.body.position.y - right.height / 2 &&
			this.body.position.y <= right.body.position.y + right.height / 2
		) {
			this.sound.rightPaddleSound.play();
			return true;
		}
		return false;
	};

	checkBallHit = (left: Paddle, right: Paddle): void => {
		if (this.isCollidedLeft(left) || this.isCollidedRight(right)) {
			this.xVelocity = -this.xVelocity;
		}
	};
}

export default Ball;
