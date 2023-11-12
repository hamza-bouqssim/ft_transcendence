import Matter from 'matter-js';

class Paddle {
	xCord: number;
	yCord: number;
	width: number;
	height: number;
	color: string;
	body: any;

	constructor(
		xCord: number,
		yCord: number,
		width: number,
		height: number,
		color: string,
	) {
		this.xCord = xCord;
		this.yCord = yCord;
		this.width = width;
		this.height = height;
		this.color = color;
	}

	draw = (): void => {
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
				chamfer: { radius: 10 },
			},
		);
	};
}

export default Paddle;
