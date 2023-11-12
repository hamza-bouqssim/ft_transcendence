import { useEffect, useRef, useState } from "react";
import PlayerScore from "@/app/components/PlayerScore";
import Matter from "matter-js";
import PongGame from "../classes/PongGame";
import { io } from "socket.io-client";

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

	useEffect(() => {
		socket.on("connect", () => console.log("Client Connected!"));
		// socket.emit("movePaddle", () => {});
		// socket.on("reply", (payload: any) => alert(payload.mssj));
	}, []);

	useEffect(() => {
		if (socket) {
			const pong = new PongGame(parentCanvasRef.current!, socket);
			pong.moveBotPaddle();
			pong.movePaddle();
		}
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
