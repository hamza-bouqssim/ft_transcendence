import Matter from "matter-js";
import { Howl } from "howler";
import Paddle from "./Paddle";
// import { useAppDispatch } from "@/redux_toolkit/hooks";
// import {
// 	incrementLeftScore,
// 	incrementRightScore,
// } from "@/redux_toolkit/game/gameSlice";

const Bodies = Matter.Bodies;

class Ball {
	// dispatch = useAppDispatch();
	xCord: number;
	yCord: number;
	radius: number;
	color: string;
	body: any;
	xVelocity: number = -1;
	yVelocity: number = -1;
	speed: number = 2;
	sound = {
		leftPaddleSound: new Howl({
			src: ["/assets/sounds/leftPaddle.wav"],
		}),
		rightPaddleSound: new Howl({
			src: ["/assets/sounds/rightPaddle.wav"],
		}),
		win: new Howl({
			src: ["/assets/sounds/winSound.mp3"],
		}),
	};
	isPaused: boolean;
	isSilenced: boolean;

	constructor(
		xCord: number,
		yCord: number,
		radius: number,
		color: string,
		isSilenced: boolean,
		isPaused: boolean,
	) {
		this.xCord = xCord;
		this.yCord = yCord;
		this.radius = radius;
		this.color = color;
		this.isPaused = isPaused;
		this.isSilenced = isSilenced;
	}

	// setNewCircleColor = (): void => {
	// 	this.body.render.fillStyle = this.color;
	// };

	drawBall = (): void => {
		this.body = Bodies.circle(this.xCord, this.yCord, this.radius, {
			render: {
				fillStyle: this.color,
			},
		});
	};

	// reset = (): void => {
	// 	Matter.Body.setPosition(this.body, {
	// 		x: this.xCord,
	// 		y: this.yCord,
	// 	});
	// };

	// setBallSpeed = (): void => {
	// 	Matter.Body.setVelocity(this.body, {
	// 		x: this.xVelocity * this.speed,
	// 		y: this.yVelocity * this.speed,
	// 	});
	// };

	// If the ball reaches the canvas boundary, reverse its vertical velocity
	// move = (render: any, left: Paddle, right: Paddle): void => {
	// 	if (
	// 		this.body.position.y + this.body.circleRadius - 1 >=
	// 			render.canvas.height ||
	// 		this.body.position.y - this.body.circleRadius <= 0
	// 	)
	// 		this.yVelocity = -this.yVelocity;

	// 	if (
	// 		this.body.position.x > render.canvas.width ||
	// 		this.body.position.x < 0
	// 	) {
	// 		this.body.position.x < 0 ? right.score++ : left.score++;
	// 		this.reset();
	// 		left.reset();
	// 		right.reset();
	// 	}
	// 	this.setBallSpeed();
	// };

	// // delete two this methods and make just one is better
	// isCollidedLeft = (left: Paddle): boolean => {
	// 	if (
	// 		this.body.position.x - this.body.circleRadius <=
	// 			left.body.position.x + left.width / 2 &&
	// 		this.body.position.y >= left.body.position.y - left.height / 2 &&
	// 		this.body.position.y <= left.body.position.y + left.height / 2
	// 	) {
	// 		this.isSilenced
	// 			? this.sound.leftPaddleSound.pause()
	// 			: this.sound.leftPaddleSound.play();
	// 		return true;
	// 	} else if (this.body.position.x < left.body.position.x) {
	// 		this.isSilenced ? this.sound.win.pause() : this.sound.win.play();
	// 	}
	// 	return false;
	// };

	// isCollidedRight = (right: Paddle): boolean => {
	// 	if (
	// 		this.body.position.x + this.body.circleRadius >=
	// 			right.body.position.x - right.width / 2 &&
	// 		this.body.position.y >= right.body.position.y - right.height / 2 &&
	// 		this.body.position.y <= right.body.position.y + right.height / 2
	// 	) {
	// 		this.isSilenced
	// 			? this.sound.rightPaddleSound.pause()
	// 			: this.sound.rightPaddleSound.play();
	// 		return true;
	// 	} else if (
	// 		this.body.position.x + this.body.circleRadius >
	// 		right.body.position.x
	// 	) {
	// 		this.isSilenced ? this.sound.win.pause() : this.sound.win.play();
	// 	}
	// 	return false;
	// };

	// checkBallHit = (left: Paddle, right: Paddle): void => {
	// 	if (this.isCollidedLeft(left) || this.isCollidedRight(right)) {
	// 		this.xVelocity = -this.xVelocity;
	// 	}
	// };
}

export default Ball;
