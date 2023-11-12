// "use client";
// import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
// 	faToggleOn,
// 	faToggleOff,
// 	faPause,
// 	faPlay,
// 	faVolumeXmark,
// 	faDoorOpen,
// 	faVolumeLow,
// 	faGauge,
// } from "@fortawesome/free-solid-svg-icons";
// import Pong from "./Pong";

// const Game = () => {
// 	const [change, setChange] = useState<{
// 		sideBar: boolean;
// 		chatBox: boolean;
// 		menu: boolean;
// 		rangeInputHidden: boolean;
// 	}>({
// 		sideBar: false,
// 		chatBox: false,
// 		menu: false,
// 		rangeInputHidden: true,
// 	});

// 	const [gameValues, setGameValues] = useState<{
// 		toggle: boolean;
// 		button: boolean;
// 		paused: boolean;
// 		silenced: boolean;
// 		ballColor: string;
// 		paddleColor: string;
// 		ballSpeed: number;
// 	}>({
// 		toggle: false,
// 		button: false,
// 		paused: false,
// 		silenced: false,
// 		ballColor: "#ffffff",
// 		paddleColor: "#FF5269",
// 		ballSpeed: 2,
// 	});

// 	return (
// 		<section className="relative h-[100vh] min-h-[850px] py-4 text-white">
// 			<div className="fixed left-[50%] top-[50%] flex h-[700px] w-full max-w-[1600px] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center px-4 py-8 lg:flex-row lg:items-end lg:justify-evenly min-[1750px]:h-[900px]">
// 				<Pong
// 					paused={gameValues.paused}
// 					silenced={gameValues.silenced}
// 					ballColor={gameValues.ballColor}
// 					paddleColor={gameValues.paddleColor}
// 					ballSpeed={gameValues.ballSpeed}
// 				>
// 					<div className="flex w-fit items-center justify-center gap-2 rounded-3xl bg-white p-1 px-3 min-[500px]:gap-4 lg:hidden">
// 						<FontAwesomeIcon
// 							icon={gameValues.toggle ? faVolumeXmark : faVolumeLow}
// 							className="h-3 w-3 rounded-[50%] bg-[#5B8CD4] p-2 hover:cursor-pointer hover:bg-[--pink-color] min-[500px]:h-4 min-[500px]:w-4 min-[500px]:p-3"
// 							onClick={() =>
// 								setGameValues({
// 									...gameValues,
// 									toggle: !gameValues.toggle,
// 									silenced: !gameValues.silenced,
// 								})
// 							}
// 						/>
// 						<input
// 							type="color"
// 							name="color"
// 							value={gameValues.ballColor}
// 							className="h-6 w-6 cursor-pointer bg-transparent min-[500px]:h-8 min-[500px]:w-8"
// 							onChange={(e) =>
// 								setGameValues({
// 									...gameValues,
// 									ballColor: e.currentTarget.value,
// 								})
// 							}
// 						/>
// 						<input
// 							type="color"
// 							name="color"
// 							value={gameValues.paddleColor}
// 							className="h-6 w-6 cursor-pointer bg-transparent min-[500px]:h-8 min-[500px]:w-8"
// 							onChange={(e) =>
// 								setGameValues({
// 									...gameValues,
// 									paddleColor: e.currentTarget.value,
// 								})
// 							}
// 						/>
// 						<div className="relative flex flex-col items-center">
// 							<input
// 								type="range"
// 								name="range"
// 								value={gameValues.ballSpeed}
// 								max={8}
// 								step={2}
// 								className={`${
// 									change.rangeInputHidden ? "hidden" : "block"
// 								} absolute -top-7 w-[75px] cursor-pointer bg-transparent accent-[--pink-color] focus:accent-[--pink-color] min-[500px]:w-[90px]`}
// 								onChange={(e) => {
// 									if (parseInt(e.currentTarget.value) < 2)
// 										e.currentTarget.value = "2";
// 									else {
// 										setGameValues({
// 											...gameValues,
// 											ballSpeed: parseInt(e.currentTarget.value),
// 										});
// 									}
// 								}}
// 							/>
// 							<FontAwesomeIcon
// 								icon={faGauge}
// 								className="h-3 w-3 rounded-[50%] bg-[#5B8CD4] p-2 hover:cursor-pointer hover:bg-[--pink-color] min-[500px]:h-4 min-[500px]:w-4 min-[500px]:p-3"
// 								onClick={() =>
// 									setChange({
// 										...change,
// 										rangeInputHidden: !change.rangeInputHidden,
// 									})
// 								}
// 							/>
// 						</div>
// 						<FontAwesomeIcon
// 							icon={gameValues.paused ? faPlay : faPause}
// 							className="h-3 w-3 rounded-[50%] bg-[#5B8CD4] p-2 hover:cursor-pointer hover:bg-[--pink-color] min-[500px]:h-4 min-[500px]:w-4 min-[500px]:p-3"
// 							onClick={() =>
// 								setGameValues({
// 									...gameValues,
// 									button: !gameValues.button,
// 									paused: !gameValues.paused,
// 								})
// 							}
// 						/>
// 						<FontAwesomeIcon
// 							icon={faDoorOpen}
// 							className="h-3 w-3 rounded-[50%] bg-[#5B8CD4] p-2 hover:cursor-pointer hover:bg-[--pink-color] min-[500px]:h-4 min-[500px]:w-4 min-[500px]:p-3"
// 						/>
// 					</div>
// 				</Pong>
// 			</div>
// 		</section>
// 	);
// };

// export default Game;
