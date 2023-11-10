import { useEffect, useRef, useState } from "react";
import { PlayerScore } from "@/app/components/PlayerCard";
import Matter from "matter-js";
import { io } from "socket.io-client";
import Ball from "./classes/Ball";
import Paddle from "./classes/Paddle";
import PongGame from "./classes/PongGame";

const Pong = (props: any) => {
	const socket = io("http://localhost:8000");

	const parentCanvasRef = useRef<HTMLDivElement>(null);
	const Render = Matter.Render;
	const Engine = Matter.Engine;
	const Runner = Matter.Runner;
	const Composite = Matter.Composite;

	const renderRef = useRef<any>(null);
	const engineRef = useRef<any>(Engine.create());
	const runnerRef = useRef<any>(Runner.create());

	let paddles: any;
	let ball: any;
	let paddlesRef = useRef<any>(null);
	let ballRef = useRef<any>(null);

	const [score, setScore] = useState<{
		leftScore: number;
		rightScore: number;
	}>({
		leftScore: 0,
		rightScore: 0,
	});

	// useEffect(() => {
	// 	const canvas = canvasRef.current!;

	// 	if (engineRef.current.world.bodies.length) {
	// 		if (props.paused != ballRef.current.isPaused) {
	// 			ballRef.current.isPaused = props.paused;
	// 			if (props.paused) {
	// 				Runner.stop(runnerRef.current);
	// 				paddlesRef.current.left.stopMoving();
	// 			} else {
	// 				Runner.run(runnerRef.current, engineRef.current);
	// 				paddlesRef.current.left.move(ballRef.current);
	// 			}
	// 		}
	// 		if (props.silenced != ballRef.current.isSilenced) {
	// 			ballRef.current.isSilenced = props.silenced;
	// 			ballRef.current.checkBallHit(
	// 				paddlesRef.current.left,
	// 				paddlesRef.current.right,
	// 			);
	// 		}
	// 		if (props.ballColor != ballRef.current.color) {
	// 			ballRef.current.color = props.ballColor;
	// 			ballRef.current.setNewCircleColor();
	// 		}
	// 		if (props.paddleColor != paddlesRef.current.left.color) {
	// 			paddlesRef.current.left.color = props.paddleColor;
	// 			paddlesRef.current.left.setNewPaddleColor();
	// 		}
	// 		if (props.ballRef != ballRef.current.speed) {
	// 			ballRef.current.speed = props.ballSpeed;
	// 			ballRef.current.setBallSpeed();
	// 		}
	// 	} else {
	// 		renderRef.current = Render.create({
	// 			canvas: canvas,
	// 			engine: engineRef.current,
	// 			context: canvas.getContext("2d")!,
	// 			options: {
	// 				background: "#3A3561",
	// 				wireframes: false,
	// 			},
	// 		});

	// 		paddles = {
	// 			left: new Paddle(
	// 				50,
	// 				canvas.height / 2,
	// 				10,
	// 				150,
	// 				props.paddleColor,
	// 				renderRef.current,
	// 			),
	// 			right: new Paddle(
	// 				canvas.width - 50,
	// 				canvas.height / 2,
	// 				10,
	// 				150,
	// 				"#4FD6FF",
	// 				renderRef.current,
	// 			),
	// 		};

	// 		paddlesRef.current = paddles;

	// 		ball = new Ball(
	// 			canvas.width / 2,
	// 			canvas.height / 2,
	// 			15,
	// 			props.ballColor,
	// 			props.paused,
	// 			props.silenced,
	// 		);

	// 		ballRef.current = ball;

	// 		paddlesRef.current.left.drawPaddle();
	// 		paddlesRef.current.right.drawPaddle();
	// 		ballRef.current.drawBall();

	// 		Composite.add(engineRef.current.world, [
	// 			paddlesRef.current.right.body,
	// 			paddlesRef.current.left.body,
	// 			ballRef.current.body,
	// 		]);

	// 		Render.run(renderRef.current);

	// 		paddlesRef.current.left.move(renderRef.current, ballRef.current);

	// 		setTimeout(() => {
	// 			Runner.run(runnerRef.current, engineRef.current);
	// 			Matter.Events.on(engineRef.current, "beforeUpdate", () => {
	// 				ballRef.current.checkBallHit(
	// 					paddlesRef.current.left,
	// 					paddlesRef.current.right,
	// 				);
	// 				ballRef.current.move(
	// 					renderRef.current,
	// 					paddlesRef.current.left,
	// 					paddlesRef.current.right,
	// 				);
	// 				paddlesRef.current.left.move(ballRef.current);
	// 				paddlesRef.current.right.move(ballRef.current);
	// 				setScore({
	// 					...score,
	// 					leftScore: paddlesRef.current.left.score,
	// 					rightScore: paddlesRef.current.right.score,
	// 				});
	// 			});
	// 		}, 1000);
	// 	}
	// }, [
	// 	props.paused,
	// 	props.silenced,
	// 	props.ballColor,
	// 	props.paddleColor,
	// 	props.ballSpeed,
	// ]);

	useEffect(() => {
		// const canvas = canvasRef.current!;

		const pong = new PongGame(parentCanvasRef.current!);
		pong.moveBotPaddle();
		pong.movePaddle();
	}, []);

	return (
		<div className="relative flex h-full w-full max-w-[750px] flex-row items-center justify-around gap-10 rounded-3xl lg:w-[90%] min-[1750px]:h-full min-[1750px]:w-full min-[1750px]:max-w-[1500px]">
			<PlayerScore
				flag="left"
				name="hamzaBouQssi"
				username="@hbouqssi"
				score={score.leftScore}
				playerBgColor={props.paddleColor}
			/>
			{/* <div className="flex h-[22%] w-full items-center justify-between bg-red-400 lg:px-10 lg:py-4 min-[1750px]:h-full">
				<PlayerScore
					flag="left"
					name="hamzaBouQssi"
					username="@hbouqssi"
					score={score.leftScore}
					playerBgColor={props.paddleColor}
				/>
				<div className="font-['Whitney_Bold'] text-3xl md:text-4xl min-[1750px]:text-6xl">
					:
				</div>
				<PlayerScore
					flag="right"
					name="hamzaBouQssi"
					username="@hbouqssi"
					score={score.rightScore}
					playerBgColor={"#4FD6FF"}
				/>
			</div> */}
			<div
				className="h-full w-[560px] shadow-[0_0_50px_2px_var(--blue-color)] min-[375px]:h-[250px] min-[490px]:h-[300px] min-[600px]:h-[360px] min-[660px]:h-[400px] md:h-[420px] lg:h-[440px] min-[1750px]:h-full"
				ref={parentCanvasRef}
			></div>

			<PlayerScore
				flag="right"
				name="hamzaBouQssi"
				username="@hbouqssi"
				score={score.rightScore}
				playerBgColor={"#4FD6FF"}
			/>
		</div>
	);
};

export default Pong;
