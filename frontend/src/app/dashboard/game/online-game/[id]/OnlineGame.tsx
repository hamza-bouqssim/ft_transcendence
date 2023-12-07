import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerScore from "@/app/components/PlayerScore";
import PongGame from "../../classes/PongGame";
import Swal from "sweetalert2";
import { SocketContext } from "../../SocketContext";
import { LoserPlayerPopUp } from "@/app/components/GamePopUp";
import { gameData } from "../../page";
import { useAtomValue } from "jotai";
import { io } from "socket.io-client";
import { socketContext } from "@/app/utils/context/socketContext";
import { UserData } from "next-auth/providers/42-school";

const OnlineGame = () => {
	const gameDataValues = useAtomValue(gameData);
	const router = useRouter();
	const socket = useContext<any>(SocketContext);
	const parentCanvasRef = useRef<HTMLDivElement>(null);
	const pongRef = useRef<any>();
	const rotateRef = useRef<boolean>(false);
	const opponentPlayer = useRef<any>(null);
	const [startGame, setStartGame] = useState<boolean>(false);
	const [score, setScore] = useState<{
		playerOne: number;
		playerTwo: number;
	}>({
		playerOne: 0,
		playerTwo: 0,
	});

	const { Userdata } = useContext<any>(socketContext);

	// 	avatar_url
	// :
	// "https://lh3.googleusercontent.com/a/ACg8ocLbffsAwsoJcCzPio-9893BMFnG9IJOC6IJebXDAeEM_w=s96-c"
	// display_name
	// :
	// "yassinekhadiri77"
	// email
	// :
	// "yassinekhadiri77@gmail.com"
	// username
	// :
	// "Yassine Khadiri"

	// useEffect(() => {
	// 	console.log("user data", Userdata);
	// 	console.log("userName", Userdata?.username);
	// }, [Userdata]);

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
		// if (!pongRef.current) {
		let timerInterval: any;

		const lunchGameListener = (payload: any) => {
			console.log("start game", payload)
			// console.log("opponant : ", payload.opponant);
			if (opponentPlayer.current) return;
			opponentPlayer.current = payload.opponant;
			rotateRef.current = payload.rotate;
			setStartGame((prev: any) => !prev);
			pongRef.current = new PongGame(
				parentCanvasRef.current!,
				gameDataValues.chosenMapIndex,
				Userdata?.display_name,
				socket,
			);
		}
		// function launch(payload: any) {
		// 	console.log("start game", payload)
		// 	// console.log("opponant : ", payload.opponant);
		// 	if (opponentPlayer.current) return;
		// 	opponentPlayer.current = payload.opponant;
		// 	rotateRef.current = payload.rotate;
		// 	setStartGame((prev: any) => !prev);
		// 	pongRef.current = new PongGame(
		// 		parentCanvasRef.current!,
		// 		gameDataValues.chosenMapIndex,
		// 		Userdata?.display_name,
		// 		socket,
		// 	);
		// }
		const gameIsFinishedListener = () => {
			pongRef.current.clear();
			LoserPlayerPopUp(router);
		};

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
			// socket.emit("launchGameRequest", gameDataValues);
			// if (opponentPlayer.current)
			// {
			// if (opponentPlayer.current) return;
			socket.emit("launchGameRequest", {
				mapIndex: gameDataValues.chosenGameMode,
				width: parentCanvasRef.current!.getBoundingClientRect().width,
				height: parentCanvasRef.current!.getBoundingClientRect().height,
			});
			socket.on("launchGame", (payload : any) => lunchGameListener(payload));
			socket.on("gameIsFinished", gameIsFinishedListener);
		});
		// } 

		return () => {
			if (score.playerOne === 10 || score.playerTwo === 10)
				socket.off("launchGame", lunchGameListener);
				socket.off("gameIsFinished", gameIsFinishedListener);
		}
	}, []);

	return (
		<div className="absolute left-[50%] top-[50%] flex h-[642px] w-[96%] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-evenly md:h-[900px] md:gap-3 md:px-4 xl:h-[700px] xl:max-w-[1280px] xl:flex-row-reverse xl:px-10 min-[1750px]:h-[900px] min-[1750px]:max-w-[1600px]">
			<PlayerScore
				flag="top"
				userName={opponentPlayer.current?.username}
				displayName={opponentPlayer.current?.display_name}
				score={score.playerOne}
				color={"#4FD6FF"}
				profileImage={opponentPlayer.current?.avatar_url}
				startGame={startGame}
			/>
			<div
				className={`${rotateRef.current? "rotate-180" : ""} h-[500px] w-full max-w-[340px] shadow-[0_0_50px_2px_var(--blue-color)] md:h-[590px] md:max-w-[380px] xl:h-[700px] xl:max-w-[420px] min-[1750px]:h-[836px] min-[1750px]:max-w-[560px]`}
				ref={parentCanvasRef}
			></div>
			<PlayerScore
				flag="bottom"
				userName={Userdata?.username}
				displayName={Userdata?.display_name}
				score={score.playerTwo}
				color={"#FF5269"}
				profileImage={Userdata?.avatar_url}
				startGame={startGame}
			/>
		</div>
	);
};

export default OnlineGame;
