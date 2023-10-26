"use client";
import SideBar from "@/app/components/SideBar";
import { useState } from "react";
import TopRightBar from "@/app/components/TopRightBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faToggleOn,
	faToggleOff,
	faPause,
	faPlay,
	faVolumeXmark,
	faDoorOpen,
	faVolumeLow,
	faGauge,
} from "@fortawesome/free-solid-svg-icons";
import Pong from "./utils/Pong";

const Game = () => {
	const [change, setChange] = useState<{
		sideBar: boolean;
		chatBox: boolean;
		menu: boolean;
		rangeInputHidden: boolean;
	}>({
		sideBar: false,
		chatBox: false,
		menu: false,
		rangeInputHidden: true,
	});

	const [gameValues, setGameValues] = useState<{
		toggle: boolean;
		button: boolean;
		paused: boolean;
		silenced: boolean;
		ballColor: string;
		paddleColor: string;
		ballSpeed: number;
	}>({
		toggle: false,
		button: false,
		paused: false,
		silenced: false,
		ballColor: "#ffffff",
		paddleColor: "#FF5269",
		ballSpeed: 2,
	});

	return (
		<section className="relative h-[100vh] min-h-[850px] py-4 text-white">
			{/* <SideBar
				sideBar={change.sideBar}
				onClick={() =>
					setChange({
						...change,
						sideBar: !change.sideBar,
						chatBox: false,
						menu: false,
					})
				}
			/>
			<TopRightBar
				menu={change.menu}
				onClick={() =>
					setChange({
						...change,
						sideBar: false,
						chatBox: false,
						menu: !change.menu,
					})
				}
			/> */}
			<div className="fixed left-[50%] top-[50%] flex h-[700px] w-full max-w-[1600px] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center px-4 py-8 lg:flex-row lg:items-end lg:justify-evenly min-[1750px]:h-[900px]">
				<Pong
					paused={gameValues.paused}
					silenced={gameValues.silenced}
					ballColor={gameValues.ballColor}
					paddleColor={gameValues.paddleColor}
					ballSpeed={gameValues.ballSpeed}
				>
					<div className="flex w-fit items-center justify-center gap-2 rounded-3xl bg-white p-1 px-3 min-[500px]:gap-4 lg:hidden">
						<FontAwesomeIcon
							icon={gameValues.toggle ? faVolumeXmark : faVolumeLow}
							className="h-3 w-3 rounded-[50%] bg-[#5B8CD4] p-2 hover:cursor-pointer hover:bg-[--pink-color] min-[500px]:h-4 min-[500px]:w-4 min-[500px]:p-3"
							onClick={() =>
								setGameValues({
									...gameValues,
									toggle: !gameValues.toggle,
									silenced: !gameValues.silenced,
								})
							}
						/>
						<input
							type="color"
							name="color"
							value={gameValues.ballColor}
							className="h-6 w-6 cursor-pointer bg-transparent min-[500px]:h-8 min-[500px]:w-8"
							onChange={(e) =>
								setGameValues({
									...gameValues,
									ballColor: e.currentTarget.value,
								})
							}
						/>
						<input
							type="color"
							name="color"
							value={gameValues.paddleColor}
							className="h-6 w-6 cursor-pointer bg-transparent min-[500px]:h-8 min-[500px]:w-8"
							onChange={(e) =>
								setGameValues({
									...gameValues,
									paddleColor: e.currentTarget.value,
								})
							}
						/>
						<div className="relative flex flex-col items-center">
							<input
								type="range"
								name="range"
								value={gameValues.ballSpeed}
								max={8}
								step={2}
								className={`${
									change.rangeInputHidden ? "hidden" : "block"
								} absolute -top-7 w-[75px] cursor-pointer bg-transparent accent-[--pink-color] focus:accent-[--pink-color] min-[500px]:w-[90px]`}
								onChange={(e) => {
									if (parseInt(e.currentTarget.value) < 2)
										e.currentTarget.value = "2";
									else {
										setGameValues({
											...gameValues,
											ballSpeed: parseInt(e.currentTarget.value),
										});
									}
								}}
							/>
							<FontAwesomeIcon
								icon={faGauge}
								className="h-3 w-3 rounded-[50%] bg-[#5B8CD4] p-2 hover:cursor-pointer hover:bg-[--pink-color] min-[500px]:h-4 min-[500px]:w-4 min-[500px]:p-3"
								onClick={() =>
									setChange({
										...change,
										rangeInputHidden: !change.rangeInputHidden,
									})
								}
							/>
						</div>
						<FontAwesomeIcon
							icon={gameValues.paused ? faPlay : faPause}
							className="h-3 w-3 rounded-[50%] bg-[#5B8CD4] p-2 hover:cursor-pointer hover:bg-[--pink-color] min-[500px]:h-4 min-[500px]:w-4 min-[500px]:p-3"
							onClick={() =>
								setGameValues({
									...gameValues,
									button: !gameValues.button,
									paused: !gameValues.paused,
								})
							}
						/>
						<FontAwesomeIcon
							icon={faDoorOpen}
							className="h-3 w-3 rounded-[50%] bg-[#5B8CD4] p-2 hover:cursor-pointer hover:bg-[--pink-color] min-[500px]:h-4 min-[500px]:w-4 min-[500px]:p-3"
						/>
					</div>
				</Pong>

				{/* Game Settings */}
				<div className="relative hidden h-[520px] w-[350px] flex-col items-center gap-6 rounded-3xl border-2 border-solid border-[#CFF4FF] py-16 font-['Whitney_Semibold'] text-lg shadow-[0_0_50px_2px_var(--blue-color)] lg:flex">
					<span className="absolute -top-5 left-[50%] -translate-x-[50%] rounded-3xl border-b-2 border-solid border-[#CFF4FF] bg-[--purple-color] px-7 py-2 font-['Whitney_Bold'] text-2xl font-bold shadow-[0_0_50px_2px_var(--blue-color)]">
						Settings
					</span>

					<div className="relative flex w-[70%] items-center justify-between border-b-2 border-solid border-[#CFF4FF] p-1">
						<span>Sounds</span>
						<FontAwesomeIcon
							icon={faToggleOn}
							className={`cursor-pointer text-3xl text-[--pink-color] ${
								gameValues.toggle ? "hidden" : "block"
							}`}
							onClick={() =>
								setGameValues({
									...gameValues,
									toggle: !gameValues.toggle,
									silenced: !gameValues.silenced,
								})
							}
						/>
						<FontAwesomeIcon
							icon={faToggleOff}
							className={`cursor-pointer text-3xl ${
								gameValues.toggle ? "block" : "hidden"
							}`}
							onClick={() =>
								setGameValues({
									...gameValues,
									toggle: !gameValues.toggle,
									silenced: !gameValues.silenced,
								})
							}
						/>
					</div>
					<div className="relative flex w-[70%] items-center justify-between border-b-2 border-solid border-[#CFF4FF] p-1">
						<span>Ball Color</span>
						<input
							type="color"
							name="color"
							value={gameValues.ballColor}
							className="h-8 w-8 cursor-pointer bg-transparent"
							onChange={(e) =>
								setGameValues({
									...gameValues,
									ballColor: e.currentTarget.value,
								})
							}
						/>
					</div>
					<div className="relative flex w-[70%] items-center justify-between border-b-2 border-solid border-[#CFF4FF] p-1">
						<span>Ball Speed</span>
						<input
							type="range"
							name="range"
							value={gameValues.ballSpeed}
							max={8}
							step={2}
							className="w-[50%] cursor-pointer bg-transparent accent-[--pink-color] focus:accent-[--pink-color]"
							onChange={(e) => {
								if (parseInt(e.currentTarget.value) < 2)
									e.currentTarget.value = "2";
								else {
									setGameValues({
										...gameValues,
										ballSpeed: parseInt(e.currentTarget.value),
									});
								}
							}}
						/>
					</div>
					<div className="relative flex w-[70%] items-center justify-between border-b-2 border-solid border-[#CFF4FF] p-1">
						<span>Paddle Color</span>
						<input
							type="color"
							name="color"
							value={gameValues.paddleColor}
							className="h-8 w-8 cursor-pointer bg-transparent"
							onChange={(e) =>
								setGameValues({
									...gameValues,
									paddleColor: e.currentTarget.value,
								})
							}
						/>
					</div>
					<div className="relative mt-2 w-[70%] text-center">
						<span className="inline-block text-center text-[12.5px] text-[#FF5269]">
							note: This button works only in{" "}
							<span className="text-[#4FD6FF]">BOT mode</span>.
						</span>
						<button
							className={`w-full rounded-xl border-b-2 border-solid border-[#CFF4FF] ${
								gameValues.button ? "bg-[#FF5269]" : "bg-[#4FD6FF]"
							} py-1 shadow-[0_0_50px_2px_var(--blue-color)]`}
							onClick={() =>
								setGameValues({
									...gameValues,
									button: !gameValues.button,
									paused: !gameValues.paused,
								})
							}
						>
							{gameValues.button ? "RESUME" : `PAUSE`}
						</button>
					</div>
					<div className="absolute bottom-16 w-[70%] text-center">
						<button
							className={`w-full rounded-xl border-b-2 border-solid border-[#CFF4FF] bg-[--purple-color] py-1 shadow-[0_0_50px_2px_var(--blue-color)] duration-300 ease-in-out hover:bg-[--pink-color]`}
						>
							EXIT
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Game;
