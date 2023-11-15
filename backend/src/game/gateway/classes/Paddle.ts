// import Matter from 'matter-js';
// import Ball from './Ball';

// export default class Paddle {
// 	xCord: number;
// 	yCord: number;
// 	resetX: number;
// 	resetY: number;
// 	width: number;
// 	height: number;
// 	color: string;
// 	body: any;
// 	render: any;
// 	currentRightPaddlePos: number;
// 	score: number = 0;

// 	constructor(
// 		xCord: number,
// 		yCord: number,
// 		width: number,
// 		height: number,
// 		color: string,
// 		render: any,
// 	) {
// 		this.xCord = xCord;
// 		this.yCord = yCord;
// 		this.resetX = this.xCord;
// 		this.resetY = this.yCord;
// 		this.width = width;
// 		this.height = height;
// 		this.color = color;
// 		this.render = render;
// 		this.currentRightPaddlePos = this.yCord;
// 	}

// 	drawPaddle = (): void => {
// 		this.body = Matter.Bodies.rectangle(
// 			this.xCord,
// 			this.yCord,
// 			this.width,
// 			this.height,
// 			{
// 				render: {
// 					fillStyle: this.color,
// 				},
// 				isStatic: true,
// 			},
// 		);
// 	};

// 	setNewPaddleColor = (): void => {
// 		this.body.render.fillStyle = this.color;
// 	};

// 	currentRightPaddlePosition = (ball: Ball): void => {
// 		if (
// 			this.body.position.y + this.height / 2 >= this.render.canvas.height &&
// 			ball.body.position.y >= this.render.canvas.height - this.height / 2
// 		)
// 			this.currentRightPaddlePos = this.render.canvas.height - this.height / 2;
// 		else if (
// 			this.body.position.y - this.height / 2 <= 0 &&
// 			ball.body.position.y <= this.height / 2
// 		)
// 			this.currentRightPaddlePos = this.height / 2;
// 		else this.currentRightPaddlePos = ball.body.position.y;

// 		Matter.Body.setPosition(this.body, {
// 			x: this.body.position.x,
// 			y: this.currentRightPaddlePos,
// 		});
// 	};

// 	applyMoving = (steps: any, key: any): void => {
// 		if (this.body.position.y <= this.height / 2 && key == 'w')
// 			this.yCord = this.height / 2;
// 		else if (
// 			this.body.position.y + this.height / 2 >= this.render.canvas.height &&
// 			key == 's'
// 		)
// 			this.yCord = this.render.canvas.height - this.height / 2;
// 		else this.yCord += steps;

// 		Matter.Body.setPosition(this.body, {
// 			x: this.xCord,
// 			y: this.yCord,
// 		});
// 	};

// 	handleKeyDown = (e: KeyboardEvent): void => {
// 		if (e.key === 'w') this.applyMoving(-15, e.key);
// 		else if (e.key === 's') this.applyMoving(15, e.key);
// 	};

// 	handleMouseMouve = (e: MouseEvent): void => {
// 		if (e.clientX < this.render.canvas.width / 2) {
// 			Matter.Body.setPosition(this.body, {
// 				x: this.xCord,
// 				y: e.clientY - this.height / 2,
// 			});
// 		}
// 	};

// 	// stopMoving = () => {
// 	// 	document.removeEventListener('keydown', this.handleKeyDown);
// 	// };

// 	// move = (ball: Ball): void => {
// 	// 	if (this.xCord < this.render.canvas.width / 2) {
// 	// 		document.addEventListener('keydown', this.handleKeyDown);
// 	// 		this.render.canvas.addEventListener('mousemove', this.handleMouseMouve);
// 	// 	}

// 	// 	if (this.xCord > this.render.canvas.width / 2)
// 	// 		this.currentRightPaddlePosition(ball);
// 	// };

// 	resetPosition = (): void => {
// 		Matter.Body.setPosition(this.body, {
// 			x: this.resetX,
// 			y: this.resetY,
// 		});
// 	};
// }
