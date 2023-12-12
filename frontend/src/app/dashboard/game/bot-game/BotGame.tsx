"use client";
import { useEffect, useRef, useState, useContext } from "react";
import PlayerScore from "@/app/components/PlayerScore";
import PongGame from "../classes/PongGame";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
	LoserPlayerPopUp,
	WinnerPlayerPopUp,
} from "@/app/components/GamePopUp";
import { socketContext } from "@/app/utils/context/socketContext";

const BotGame = ({ mapIndex }: any) => {
	const router = useRouter();
	const parentCanvasRef = useRef<HTMLDivElement>(null);
	const pongRef = useRef<any>();
	const [startGame, setStartGame] = useState<boolean>(false);
	const [score, setScore] = useState<{
		playerScore: number;
		botScore: number;
	}>({
		playerScore: 0,
		botScore: 0,
	});
	const { Userdata } = useContext<any>(socketContext);

	useEffect(() => {
		let timerInterval: any;

		Swal.fire({
			title: "Game Will Start In",
			icon: "info",
			iconColor: "var(--pink-color)",
			color: "#ffff",
			html: "<b style='font-size:80px'></b>&emsp;Seconds",
			timer: 3 * 1000,
			background: "#2E2F54",
			customClass: "rounded-[30px] font-['Whitney_BlackSc'] text-sm",
			timerProgressBar: true,
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading();
				const timer = Swal.getPopup()!.querySelector("b");
				timerInterval = setInterval(() => {
					timer!.textContent = `${(Swal.getTimerLeft()! / 1000).toFixed(0)}`;
				}, 100);
				const timerProgressBar = Swal.getPopup()!.querySelector(
					".swal2-timer-progress-bar",
				) as HTMLElement;
				timerProgressBar!.style.backgroundColor = "var(--pink-color)";
			},
			willClose: () => {
				clearInterval(timerInterval);
			},
		}).then(() => {
			setStartGame((prev: any) => !prev);
			pongRef.current = new PongGame(parentCanvasRef.current!, mapIndex);

			const scoreInterval = setInterval(() => {
				if (
					pongRef.current.botScore === 8 ||
					pongRef.current.playerScore === 8
				) {
					pongRef.current.clear();
					clearInterval(scoreInterval);
					pongRef.current.playerScore === 8
						? WinnerPlayerPopUp(router)
						: LoserPlayerPopUp(router);
				}

				setScore({
					...score,
					playerScore: pongRef.current.playerScore,
					botScore: pongRef.current.botScore,
				});
			}, 10);
		});

		return () => pongRef.current?.clear();
	}, []);

	return (
		<div className="absolute left-[50%] top-[50%] flex h-[642px] w-[96%] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-evenly md:h-[900px] md:gap-3 md:px-4 xl:h-[700px] xl:max-w-[1280px] xl:flex-row-reverse xl:px-10 min-[1750px]:h-[900px] min-[1750px]:max-w-[1600px]">
			<PlayerScore
				flag="top"
				userName="Mr.BOT"
				displayName="bot"
				color={"#4FD6FF"}
				profileImage={"/assets/bot.png"}
				startGame={startGame}
				score={score.botScore}
			/>
			<div
				className={`h-[500px] w-full max-w-[340px] shadow-[0_0_50px_2px_var(--blue-color)] md:h-[590px] md:max-w-[380px] xl:h-[700px] xl:max-w-[420px] min-[1750px]:h-[836px] min-[1750px]:max-w-[560px]`}
				ref={parentCanvasRef}
			></div>
			<PlayerScore
				flag="bottom"
				userName={Userdata?.username}
				displayName={Userdata?.display_name}
				color={"#FF5269"}
				profileImage={Userdata?.avatar_url}
				startGame={startGame}
				score={score.playerScore}
			/>
		</div>
	);
};

export default BotGame;
