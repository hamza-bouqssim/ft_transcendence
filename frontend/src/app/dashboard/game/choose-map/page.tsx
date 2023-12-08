"use client";
import { useRef, useContext, useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { gameData } from "../page";
import { SocketContext } from "../SocketContext";
import ChoseMap from "../choseMap";
import MatchMaking from "../match-making/page";
import { socketContext } from "@/app/utils/context/socketContext";
import OnlineGame from "../online-game/[id]/OnlineGame";
import Swal from "sweetalert2";
import { LoserPlayerPopUp } from "@/app/components/GamePopUp";
import PongGame from "../classes/PongGame";

const sleep = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const ChooseMap = () => {
	const socket = useContext(SocketContext);
	const gameDataValues = useAtomValue(gameData);
	const setGameData = useSetAtom(gameData);
	const router = useRouter();
	const swiperRef = useRef<any>(null);
	const [pageLink, setPageLink] = useState<any>("ChooseMap");
	const { Userdata } = useContext<any>(socketContext);
	const [opponentPlayer, setOpponentPlayer] = useState<{
		username: string;
		display_name: string;
		avatar_url: string;
	}>({
		username: "",
		display_name: "",
		avatar_url: "/assets/unknown.png",
	});
	const parentCanvasRef = useRef<HTMLDivElement>(null);
	const [startGame, setStartGame] = useState<boolean>(false);
	const [score, setScore] = useState<{
		playerOne: number;
		playerTwo: number;
	}>({
		playerOne: 0,
		playerTwo: 0,
	});
	const pongRef = useRef<any>();
	const rotateRef = useRef<boolean>(false);

	const handleClick = (): void => {
		setGameData((prevGameData) => ({
			...prevGameData,
			chosenMapIndex: swiperRef.current.swiper.realIndex,
		}));

		if (gameDataValues.chosenGameMode === "Online Game") {
			socket.emit("joinGame", {
				mapIndex: swiperRef.current.swiper.realIndex,
			});
			setPageLink("matchMaking");
		} else router.push("./bot-game");
	};

	useEffect(() => {
		const listener = (payload: any) => {
			setOpponentPlayer(payload.opponent);
			sleep(3000);
			setPageLink("onlineGame");
			// router.push(`./online-game/${payload.idGame}`);
		};

		socket.on("startGame", listener);
		// return () => {
		// 	socket.off("startGame", listener);
		// };
	}, [socket]);

	useEffect(() => {
		if (pageLink === "onlineGame") {
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
		}
	}, []);

	useEffect(() => {
		if (pageLink === "onlineGame") {
			let timerInterval: any;

			const lunchGameListener = (payload: any) => {
				console.log("start game", payload);
				// console.log("opponant : ", payload.opponant);
				// if (opponentPlayer) return;
				rotateRef.current = payload.rotate;
				setStartGame((prev: any) => !prev);
				pongRef.current = new PongGame(
					parentCanvasRef.current!,
					gameDataValues.chosenMapIndex,
					Userdata?.display_name,
					socket,
				);
			};

			const gameIsFinishedListener = () => {
				// pongRef.current.clear();
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
				console.log("launchhhhhhhhh");
				socket.emit("launchGameRequest", {
					mapIndex: gameDataValues.chosenGameMode,
					width: parentCanvasRef.current!.getBoundingClientRect().width,
					height: parentCanvasRef.current!.getBoundingClientRect().height,
					user: Userdata.display_name
				});
				socket.on("launchGame", lunchGameListener);
				socket.on("gameIsFinished", gameIsFinishedListener);
			});

			// return () => {
			// 	if (score.playerOne === 10 || score.playerTwo === 10)
			// 		socket.off("launchGame", lunchGameListener);
			// 		socket.off("gameIsFinished", gameIsFinishedListener);
			// }
		}
	}, [pageLink]);

	return (
		<>
			{pageLink === "ChooseMap" && (
				<ChoseMap onClick={handleClick} ref={swiperRef} />
			)}
			{pageLink === "matchMaking" && (
				<MatchMaking userData={Userdata} opponentPlayer={opponentPlayer} />
			)}
			{pageLink === "onlineGame" && (
				<OnlineGame
					startGame={true}
					score={score}
					ref={parentCanvasRef}
					opponentPlayer={opponentPlayer}
					rotateRef={rotateRef}
				/>
			)}
		</>
	);
};

export default ChooseMap;
