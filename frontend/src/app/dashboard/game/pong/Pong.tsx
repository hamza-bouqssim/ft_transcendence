import { useEffect, useRef, useState } from "react";
import PlayerScore from "@/app/components/PlayerScore";
import PongGame from "../classes/PongGame";
import { io } from "socket.io-client";

const Pong = (props: any) => {
	const socket = io("http://localhost:8000/game");
	console.log("socket:", socket)

	const parentCanvasRef = useRef<HTMLDivElement>(null);

	const [score, setScore] = useState<{
		leftScore: number;
		rightScore: number;
	}>({
		leftScore: 0,
		rightScore: 0,
	});

	useEffect(() => {
		socket.on("connect", () => {
			console.log("is connent");
		});
	}, []);

	useEffect(() => {
		if (socket) {
			const pong = new PongGame(parentCanvasRef.current!, socket);
			pong.moveBotPaddle();
			pong.movePaddle();
		}
	}, []);

	return (
		<div className="absolute left-[50%] top-[50%] flex h-[642px] w-[96%] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-evenly md:h-[900px] md:gap-3 md:px-4 xl:h-[700px] xl:max-w-[1280px] xl:flex-row-reverse xl:px-10 min-[1750px]:h-[900px] min-[1750px]:max-w-[1600px]">
			<PlayerScore
				flag="top"
				name="Mr.BOT"
				username="@bot"
				score={score.rightScore}
				playerBgColor={"#4FD6FF"}
				isBotPlayer={true}
				startGame={false}
			/>
			<div
				className="h-[500px] w-full max-w-[340px] shadow-[0_0_50px_2px_var(--blue-color)] md:h-[590px] md:max-w-[380px] xl:h-[700px] xl:max-w-[420px] min-[1750px]:h-[836px] min-[1750px]:max-w-[560px]"
				ref={parentCanvasRef}
			></div>
			<PlayerScore
				flag="bottom"
				name="hamzaBouQssi"
				username="@hbouqssi"
				score={score.leftScore}
				playerBgColor={"#FF5269"}
				isBotPlayer={false}
				startGame={false}
			/>
		</div>
	);
};

export default Pong;
