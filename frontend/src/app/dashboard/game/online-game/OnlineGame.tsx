"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerScore from "../../../components/PlayerScore";
import PongGame from "../utils/classes/PongGame";
import {
	LoserPlayerPopUp,
	WinnerPlayerPopUp,
} from "../../../components/GamePopUp";
import { socketContext } from "../../../utils/context/socketContext";
import { useGameSocket } from "../../../providers/game-socket-provider";
import { OpponentData, getCurrentSizes } from "../utils/data";
import { useAtomValue, useSetAtom } from "jotai";

const OnlineGame = ({ mapIndex }: any) => {
	const router = useRouter();
	const parentCanvasRef = useRef<HTMLDivElement>(null);
	const pongRef = useRef<any>(null);
	const [startGame, setStartGame] = useState<boolean>(false);
	const [score, setScore] = useState<{
		playerOne: number;
		playerTwo: number;
	}>({
		playerOne: 0,
		playerTwo: 0,
	});
	const gameSocket = useGameSocket();
	const { Userdata } = useContext<any>(socketContext);
	const opponentPlayer = useAtomValue(OpponentData);
	const setClearAtom = useSetAtom(OpponentData);
	const clearAtomData = () => {
		setClearAtom(() => ({
			opponent: {
				username: "",
				display_name: "",
				avatar_url: "/assets/unknown.png",
			},
			isRotate: false,
			mapIndex: -1,
		}));
	};

	const [currentSize, setCurrentSize] = useState<{
		width: number;
		height: number;
	}>({
		width: 560,
		height: 836,
	});
	useEffect(() => {
		const parentWidth: number = parentCanvasRef.current?.clientWidth!;
		const parentHeight: number = parentCanvasRef.current?.clientHeight!;

		setCurrentSize({
			...currentSize,
			width: getCurrentSizes(parentWidth, parentHeight)[0],
			height: getCurrentSizes(parentWidth, parentHeight)[1],
		});

		//TODO: don't forget to clear Event
	}, []);

	useEffect(() => {
		if (opponentPlayer.opponent.username === "") {
			router.push("/dashboard/game/", { scroll: false });
			return;
		}
		const handleRedirect = () => {
			router.push("/dashboard/game/", { scroll: false });
		}
		window.addEventListener("popstate", handleRedirect);
		window.addEventListener("offline", handleRedirect);
		const updateScoreListener = (playersScore: any) => {
			setScore({
				...score,
				playerOne: playersScore.yourScore,
				playerTwo: playersScore.opponantScore,
			});
		};
		gameSocket.on("updateScore", updateScoreListener);
		return () =>{
			gameSocket.off("updateScore");
			window.removeEventListener("popstate", handleRedirect);
			window.removeEventListener("offline", handleRedirect);
		}
	}, []);

	useEffect(() => {

		const handleLaunchGame = () => {
			if (!pongRef.current) {
				pongRef.current = new PongGame(
					parentCanvasRef.current!,
					mapIndex,
					Userdata?.display_name,
					gameSocket,
				);
			}
		};

		const handleGameIsFinished = (payload: { status: string }) => {
			// clearAtomData();
			// setStartGame((prev: any) => !prev);
			if (payload.status === "winner") WinnerPlayerPopUp(router);
			else LoserPlayerPopUp(router);
			// pongRef.current?.clear();
		};
		setTimeout(() => {
			gameSocket.emit("launchGameRequest");
			setStartGame((prev: any) => !prev);
		}, 3000);
		gameSocket.on("launchGame", handleLaunchGame);
		gameSocket.on("gameIsFinished", handleGameIsFinished);

		return () => {
			gameSocket.off("launchGame", handleLaunchGame);
			gameSocket.off("gameIsFinished", handleGameIsFinished);
			pongRef.current?.clear();
			clearAtomData();
		};
	}, []);

	return (
		<div
			style={{ maxWidth: currentSize.width, maxHeight: currentSize.height }}
			className={`${
				opponentPlayer.isRotate ? "rotate-180" : ""
			} absolute left-[50%] top-[50%] h-[90vh] w-[80vw] -translate-x-[50%] -translate-y-[50%]`}
			ref={parentCanvasRef}
		>
			{startGame && (
				<div
					className={`
				${opponentPlayer.isRotate ? "-rotate-180" : ""}
				absolute left-[50%] top-[50%] flex aspect-[2.5/1] w-full -translate-x-[50%] -translate-y-[50%] flex-col items-center gap-[5%] px-[7%]`}
				>
					<PlayerScore
						flag="top"
						color={opponentPlayer.isRotate ? "#ff526990" : "#4fd6ff90"}
						score={score.playerTwo}
					/>
					<PlayerScore
						flag="bottom"
						color={opponentPlayer.isRotate ? "#4fd6ff90" : "#ff526990"}
						score={score.playerOne}
					/>
				</div>
			)}
		</div>
	);
};

export default OnlineGame;
