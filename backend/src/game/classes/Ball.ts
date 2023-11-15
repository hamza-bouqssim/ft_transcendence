
import * as Matter from 'matter-js';


import { Howl } from 'howler';

const Bodies = Matter.Bodies;

class Ball {
	xCord: number;
	yCord: number;
	radius: number;
	color: string;
	body: any;
	direction: number = Math.random() * 4;
	speed: number = 2;
	sound = {
		leftPaddleSound: new Howl({
			src: ['/assets/sounds/leftPaddle.wav'],
		}),
		rightPaddleSound: new Howl({
			src: ['/assets/sounds/rightPaddle.wav'],
		}),
		win: new Howl({
			src: ['/assets/sounds/winSound.mp3'],
		}),
	};

	constructor(xCord: number, yCord: number, radius: number, color: string) {
		this.xCord = xCord;
		this.yCord = yCord;
		this.radius = radius;
		this.color = color;
	}

	draw = (): void => {
		this.body = Bodies.circle(this.xCord, this.yCord, this.radius, {
			render: {
				fillStyle: this.color,
			},
			frictionAir: 0,
			friction: 0,
			inertia: Infinity,
			restitution: 1,
		});
		Matter.Body.setVelocity(this.body, {
			x: 8,
			y: 8,
		});
	};
}

export default Ball;
