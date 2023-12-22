"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerScore from "@/app/components/PlayerScore";
import PongGame from "../utils/classes/PongGame";
import {
	LoserPlayerPopUp,
	WinnerPlayerPopUp,
} from "@/app/components/GamePopUp";
import { socketContext } from "@/app/utils/context/socketContext";
import { useGameSocket } from "@/app/providers/game-socket-provider";
import { OpponentData, getCurrentSizes } from "../utils/data";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

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
	}, []);

	useEffect(() => {
		console.log("online-game-score-useffect");
		if (opponentPlayer.opponent.username === "") {
			router.push("/dashboard/game", {scroll: false});
			return;
		}
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

	useEffect(() => {
		console.log("online-game-score-useffect2");

		const handleLaunchGame = (payload: any) => {
			console.log("from lauch game listern!!!!!!!!!!!!!!!!!!");
			// opponentPlayer.current = payload.opponant;
			// isRotate.current = payload.rotate;
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
			// clearAtomData();
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
		const handleRedirectUser = (payload: any) => {
			if (Userdata?.display_name === payload.display_name)
				router.push("/dashboard/", { scroll: false });
		};
		gameSocket.on("redirectUser", handleRedirectUser);
		gameSocket.on("launchGame", handleLaunchGame);
		gameSocket.on("gameIsFinished", handleGameIsFinished);

		return () => {
			console.log("remove launchGame event!");
			console.log("remove gameIsFinished event!");
			gameSocket.off("launchGame", handleLaunchGame);
			gameSocket.off("gameIsFinished", handleGameIsFinished);
			gameSocket.off("redirectUser", handleRedirectUser);
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