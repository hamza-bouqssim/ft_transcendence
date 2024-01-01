"use client";
import { useEffect, useRef, useState } from "react";
import PongGame from "../utils/classes/PongGame";
import { usePathname, useRouter } from "next/navigation";
import {
	LoserPlayerPopUp,
	WinnerPlayerPopUp,
} from "../../../components/GamePopUp";
import { getCurrentSizes } from "../utils/data";
import PlayerScore from "../../../components/PlayerScore";

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
	const [currentSize, setCurrentSize] = useState<{
		width: number;
		height: number;
	}>({
		width: 500,
		height: 800,
	});

	// const pathName = usePathname();


	useEffect(() => {
		const parentWidth: number = parentCanvasRef.current?.clientWidth!;
		const parentHeight: number = parentCanvasRef.current?.clientHeight!;

		setCurrentSize({
			...currentSize,
			width: getCurrentSizes(parentWidth, parentHeight)[0],
			height: getCurrentSizes(parentWidth, parentHeight)[1],
		});

		// if (pathName.endsWith("/game/bot-game/maps/0")) router.push("/dashboard");

		// function handleBackButton(e: PopStateEvent) {
		// 	const confirmation = confirm("Are you sure you want to go back?");
		// 	if (confirmation) {
		// 		alert("Going back!");
		// 	} else {
		// 		// Push the current state back to the history so the user stays on the current page
		// 		history.pushState({}, "", window.location.href);
		// 	}
		// }

		// window.addEventListener("popstate", handleBackButton);
	}, []);

	useEffect(() => {
		let scoreInterval: NodeJS.Timeout;
		setStartGame((prev: any) => !prev);
		pongRef.current = new PongGame(parentCanvasRef.current!, mapIndex);

		scoreInterval = setInterval(() => {
			if (pongRef.current.botScore === 7 || pongRef.current.playerScore === 7) {
				setStartGame((prev: any) => !prev);
				pongRef.current.clear();
				clearInterval(scoreInterval);
				pongRef.current.playerScore === 7
					? WinnerPlayerPopUp(router)
					: LoserPlayerPopUp(router);
			}

			setScore({
				...score,
				playerScore: pongRef.current.playerScore,
				botScore: pongRef.current.botScore,
			});
		}, 10);

		return () => {
			pongRef.current?.clear();
			clearInterval(scoreInterval);
		};
	}, []);

	return (
    <>
      <div
        style={{ maxWidth: currentSize.width, maxHeight: currentSize.height }}
        className={`absolute left-[50%] top-[50%] h-[90vh] w-[80vw] -translate-x-[50%] -translate-y-[50%]`}
        ref={parentCanvasRef}
      >
        {startGame && (
          <div className="absolute left-[50%] top-[50%] flex aspect-[2.5/1] w-full -translate-x-[50%] -translate-y-[50%] flex-col items-center gap-[5%] px-[7%]">
            <PlayerScore flag="top" color="#4fd6ff90" score={score.botScore} />
            <PlayerScore
              flag="bottom"
              color="#ff526990"
              score={score.playerScore}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default BotGame;
