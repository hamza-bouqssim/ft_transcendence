"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PlayerScore from "@/app/components/PlayerScore";
import PongGame from "../classes/PongGame";
import Swal from "sweetalert2";
import {
	ReloadPage,
	LoserPlayerPopUp,
	WinnerPlayerPopUp,
} from "@/app/components/GamePopUp";
import { socket, socketContext } from "@/app/utils/context/socketContext";
import { useGameSocket } from "@/app/providers/game-socket-provider";

const OnlineGame = ({ mapIndex }: any) => {
	const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
	const router = useRouter();
	const parentCanvasRef = useRef<HTMLDivElement>(null);
	const isRotate = useRef<boolean>(false);
	const pongRef = useRef<any>(null);
	const opponentPlayer = useRef<any>(null);
	const [startGame, setStartGame] = useState<boolean>(false);
	const [score, setScore] = useState<{
		playerOne: number;
		playerTwo: number;
	}>({
		playerOne: 0,
		playerTwo: 0,
	});
	const gameSocket = useGameSocket();

	console.log("map index:", mapIndex);

	const { Userdata } = useContext<any>(socketContext);

	useEffect(() => {
		console.log("online-game-score-useffect");
		const updateScoreListener = (playersScore: any) => {
			setScore({
				...score,
				playerOne: playersScore.yourScore,
				playerTwo: playersScore.opponantScore,
			});
		};
		gameSocket.on("updateScore", updateScoreListener);
		return () => void gameSocket.off("updateScore");
	}, []);

	// useEffect(() => {
	// 	const handleUnload = (event) => {
	// 		event.preventDefault();
	// 		router.push("/dashboard");
	// 	};

	// 	window.addEventListener("beforeunload", handleUnload);

	// 	return () => window.removeEventListener("beforeunload", handleUnload);
	// }, []);

	useEffect(() => {
		console.log("online-game-score-useffect2");

		const handleLaunchGame = (payload: any) => {
			console.log("from lauch game listern!!!!!!!!!!!!!!!!!!");
			opponentPlayer.current = payload.opponant;
			isRotate.current = payload.rotate;
			if (!pongRef.current) {
				console.log("Create game!");
				pongRef.current = new PongGame(
					parentCanvasRef.current!,
					mapIndex,
					Userdata?.display_name,
					gameSocket,
				);
			}
			console.log("from lauch game listern");
		};

		const handleGameIsFinished = (payload: { status: string }) => {
			if (payload.status === "winner") WinnerPlayerPopUp(router);
			else LoserPlayerPopUp(router);
			// pongRef.current?.clear();
		};
		setTimeout(() => {
			gameSocket.emit("launchGameRequest", {
				mapIndex: mapIndex,
				width: parentCanvasRef.current?.getBoundingClientRect().width,
				height: parentCanvasRef.current?.getBoundingClientRect().height,
			});
			setStartGame((prev: any) => !prev);
		}, 3000);
		console.log("setup launchGame event!");
		console.log("setup gameIsFinished event!");
		gameSocket.on("launchGame", handleLaunchGame);
		gameSocket.on("gameIsFinished", handleGameIsFinished);

		return () => {
			console.log("remove launchGame event!");
			console.log("remove gameIsFinished event!");
			gameSocket.off("launchGame", handleLaunchGame);
			gameSocket.off("gameIsFinished", handleGameIsFinished);
			pongRef.current?.clear();
		};
	}, []);

	return (
		<div className="absolute left-[50%] top-[50%] flex h-[642px] w-[96%] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-evenly md:h-[900px] md:gap-3 md:px-4 xl:h-[700px] xl:max-w-[1280px] xl:flex-row-reverse xl:px-10 min-[1750px]:h-[900px] min-[1750px]:max-w-[1600px]">
			<PlayerScore
				flag="top"
				userName={opponentPlayer.current?.username}
				displayName={opponentPlayer.current?.display_name}
				score={score.playerTwo}
				color={isRotate.current ? "#FF5269" : "#4FD6FF"}
				profileImage={opponentPlayer.current?.avatar_url}
				startGame={startGame}
			/>
			<div
				className={`${
					isRotate.current ? "rotate-180" : ""
				} h-[500px] w-full max-w-[340px] shadow-[0_0_50px_2px_var(--blue-color)] md:h-[590px] md:max-w-[380px] xl:h-[700px] xl:max-w-[420px] min-[1750px]:h-[836px] min-[1750px]:max-w-[560px]`}
				ref={parentCanvasRef}
			></div>
			<PlayerScore
				flag="bottom"
				userName={Userdata?.username}
				displayName={Userdata?.display_name}
				score={score.playerOne}
				color={isRotate.current ? "#4FD6FF" : "#FF5269"}
				profileImage={Userdata?.avatar_url}
				startGame={startGame}
			/>
		</div>
	);
};

export default OnlineGame;
