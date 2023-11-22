import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import PlayerScore from "@/app/components/PlayerScore";
import PongGame from "../classes/PongGame";
import Swal from "sweetalert2";
import { SocketContext } from "../SocketContext";
import { GameFinishedPopUp, LoserPlayerPopUp, WinnerPlayerPopUp } from "@/app/components/GamePopUp";

const OnlineGame = () => {
	const router = useRouter();
	const socket = useContext<any>(SocketContext);

	console.log("socket:", socket);

	const parentCanvasRef = useRef<HTMLDivElement>(null);

	const [score, setScore] = useState<{
		playerOne: number;
		playerTwo: number;
	}>({
		playerOne: 0,
		playerTwo: 0,
	});
	const [startGame, setStartGame] = useState<boolean>(false);

	useEffect(() => {
		socket.on("connect", () => {
			console.log("A Pong Client Is Connected!");
		});
		socket.on("updateScore", (playersScore: any) => {
			setScore({
				...score,
				playerOne: playersScore.playerOneScore,
				playerTwo: playersScore.playerTwoScore,
			});
		});
	}, []);

	useEffect(() => {
		let timerInterval: any;
		let endGame: any;
		let pong: PongGame;

		Swal.fire({
			title: "Game Will Start In",
			icon: "info",
			iconColor: "var(--pink-color)",
			color: "#ffff",
			html: "<b style='font-size:80px'></b>&emsp;Seconds",
			timer: 5 * 1000,
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
			socket.emit("launchGameRequest", () => {
				console.log("req to start Game!");
			});
			socket.on("launchGame", () => {
				setStartGame((prev: any) => !prev);
				pong = new PongGame(parentCanvasRef.current!, socket);
			});
			socket.on("gameIsFinished", () => {
				pong.clear();
				// endGame = () => pong.clear();
				// endGame();
				LoserPlayerPopUp(router);
			})
		});
		// return () =>
		// {
		// 	alert("Unmounted!")
		// 	// endGame();
		// }
	}, []);

	return (
		<div className="absolute left-[50%] top-[50%] flex h-[642px] w-[96%] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-evenly md:h-[900px] md:gap-3 md:px-4 xl:h-[700px] xl:max-w-[1280px] xl:flex-row-reverse xl:px-10 min-[1750px]:h-[900px] min-[1750px]:max-w-[1600px]">
			<PlayerScore
				flag="top"
				name="hamzaBouQssi"
				username="@hbouqssi"
				score={score.playerOne}
				playerBgColor={"#4FD6FF"}
				isBotPlayer={false}
				startGame={startGame}
			/>
			<div
				className="h-[500px] w-full max-w-[340px] shadow-[0_0_50px_2px_var(--blue-color)] md:h-[590px] md:max-w-[380px] xl:h-[700px] xl:max-w-[420px] min-[1750px]:h-[836px] min-[1750px]:max-w-[560px]"
				ref={parentCanvasRef}
			></div>
			<PlayerScore
				flag="bottom"
				name="hamzaBouQssi"
				username="@hbouqssi"
				score={score.playerTwo}
				playerBgColor={"#FF5269"}
				isBotPlayer={false}
				startGame={startGame}
			/>
		</div>
	);
};

export default OnlineGame;
