"use client";
import { useContext, useEffect, useRef, useState } from "react";
<<<<<<< HEAD
import { usePathname, useRouter } from "next/navigation";
import PlayerScore from "@/app/components/PlayerScore";
import PongGame from "../classes/PongGame";
import Swal from "sweetalert2";
import {
	ReloadPage,
=======
import { useRouter } from "next/navigation";
import PlayerScore from "@/app/components/PlayerScore";
import PongGame from "../classes/PongGame";
import {
>>>>>>> origin/Samer_V1
	LoserPlayerPopUp,
	WinnerPlayerPopUp,
} from "@/app/components/GamePopUp";
import { socket, socketContext } from "@/app/utils/context/socketContext";
import { useGameSocket } from "@/app/providers/game-socket-provider";
<<<<<<< HEAD

const OnlineGame = ({ mapIndex }: any) => {
	const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
	const router = useRouter();
	const parentCanvasRef = useRef<HTMLDivElement>(null);
	const isRotate = useRef<boolean>(false);
	const pongRef = useRef<any>(null);
	const opponentPlayer = useRef<any>(null);
=======
import { opponentData } from "./match-making/page";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

const OnlineGame = ({ mapIndex }: any) => {
	// const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
	const router = useRouter();
	const parentCanvasRef = useRef<HTMLDivElement>(null);
	// const isRotate = useRef<boolean>(false);
	const pongRef = useRef<any>(null);
	// const opponentPlayer = useRef<any>(null);
>>>>>>> origin/Samer_V1
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
<<<<<<< HEAD

	useEffect(() => {
		console.log("online-game-score-useffect");
=======
	const opponentPlayer = useAtomValue(opponentData);
	const setClearAtom = useSetAtom(opponentData);
	const clearAtomData = () => {
		setClearAtom(() => ({
			opponent: {
				username: "",
				display_name: "",
				avatar_url: "/assets/unknown.png",
			},
			isRotate: false,
		}));

		// console.log("setAtom", clearAtom);
	};

	useEffect(() => {
		console.log("online-game-score-useffect");
		if (opponentPlayer.opponent.username === "") {
			router.push("/dashboard/game");
			return;
		}
>>>>>>> origin/Samer_V1
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

<<<<<<< HEAD
	// useEffect(() => {
	// 	const handleUnload = (event) => {
	// 		event.preventDefault();
	// 		router.push("/dashboard");
	// 	};

	// 	window.addEventListener("beforeunload", handleUnload);

	// 	return () => window.removeEventListener("beforeunload", handleUnload);
	// }, []);

=======
>>>>>>> origin/Samer_V1
	useEffect(() => {
		console.log("online-game-score-useffect2");

		const handleLaunchGame = (payload: any) => {
			console.log("from lauch game listern!!!!!!!!!!!!!!!!!!");
<<<<<<< HEAD
			opponentPlayer.current = payload.opponant;
			isRotate.current = payload.rotate;
=======
			// opponentPlayer.current = payload.opponant;
			// isRotate.current = payload.rotate;
>>>>>>> origin/Samer_V1
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
<<<<<<< HEAD
=======
			// clearAtomData();
>>>>>>> origin/Samer_V1
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
<<<<<<< HEAD
=======
			clearAtomData();
>>>>>>> origin/Samer_V1
		};
	}, []);

	return (
		<div className="absolute left-[50%] top-[50%] flex h-[642px] w-[96%] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-evenly md:h-[900px] md:gap-3 md:px-4 xl:h-[700px] xl:max-w-[1280px] xl:flex-row-reverse xl:px-10 min-[1750px]:h-[900px] min-[1750px]:max-w-[1600px]">
<<<<<<< HEAD
			<PlayerScore
=======
			{/* <PlayerScore
>>>>>>> origin/Samer_V1
				flag="top"
				userName={opponentPlayer.current?.username}
				displayName={opponentPlayer.current?.display_name}
				score={score.playerTwo}
				color={isRotate.current ? "#FF5269" : "#4FD6FF"}
				profileImage={opponentPlayer.current?.avatar_url}
				startGame={startGame}
<<<<<<< HEAD
			/>
			<div
=======
			/> */}

			<PlayerScore
				flag="top"
				userName={opponentPlayer.opponent.username}
				displayName={opponentPlayer.opponent.display_name}
				score={score.playerTwo}
				color={opponentPlayer.isRotate ? "#FF5269" : "#4FD6FF"}
				profileImage={opponentPlayer.opponent.avatar_url}
				startGame={startGame}
			/>

			{/* <div
>>>>>>> origin/Samer_V1
				className={`${
					isRotate.current ? "rotate-180" : ""
				} h-[500px] w-full max-w-[340px] shadow-[0_0_50px_2px_var(--blue-color)] md:h-[590px] md:max-w-[380px] xl:h-[700px] xl:max-w-[420px] min-[1750px]:h-[836px] min-[1750px]:max-w-[560px]`}
				ref={parentCanvasRef}
<<<<<<< HEAD
=======
			></div> */}

			<div
				className={`${
					opponentPlayer.isRotate ? "rotate-180" : ""
				} h-[500px] w-full max-w-[340px] shadow-[0_0_50px_2px_var(--blue-color)] md:h-[590px] md:max-w-[380px] xl:h-[700px] xl:max-w-[420px] min-[1750px]:h-[836px] min-[1750px]:max-w-[560px]`}
				ref={parentCanvasRef}
>>>>>>> origin/Samer_V1
			></div>
			<PlayerScore
				flag="bottom"
				userName={Userdata?.username}
				displayName={Userdata?.display_name}
				score={score.playerOne}
<<<<<<< HEAD
				color={isRotate.current ? "#4FD6FF" : "#FF5269"}
=======
				color={opponentPlayer.isRotate ? "#4FD6FF" : "#FF5269"}
>>>>>>> origin/Samer_V1
				profileImage={Userdata?.avatar_url}
				startGame={startGame}
			/>
		</div>
	);
};

export default OnlineGame;
