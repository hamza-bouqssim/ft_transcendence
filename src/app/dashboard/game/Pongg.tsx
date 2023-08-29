import Matter, { Bodies, Composite } from "matter-js";
import { useEffect, useRef, useState } from "react";
import Pong from "../classes/Pong";
import Paddle from "../classes/Paddle";
import Ball from "../classes/Ball";

const Pongg = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current as HTMLCanvasElement;

		const paddles = {
			left: new Paddle(50, canvas.height / 2, 10, 150, "#FF5269"),
			right: new Paddle(
				canvas.width - 50,
				canvas.height / 2,
				10,
				150,
				"#4FD6FF",
			),
		};

		const ball = new Ball(canvas.width / 2, canvas.height / 2, 15, "white");

		let pong = new Pong(canvas, paddles.right, paddles.left, ball);

		pong.init();
		pong.draw();
		pong.start();
	}, []);

	return (
		<div className="relative h-full w-full">
			<canvas
				className="fixed left-[50%] top-24 h-[480px] w-[90%] max-w-[800px] -translate-x-[50%] rounded-3xl border-2 border-solid border-[#CFF4FF] shadow-[0_0_50px_2px_var(--blue-color)]"
				ref={canvasRef}
				width={800}
				height={600}
			></canvas>
		</div>
	);
};

export default Pongg;
