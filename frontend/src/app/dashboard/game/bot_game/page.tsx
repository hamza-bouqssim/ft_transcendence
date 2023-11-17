"use client";
import BotGame from "./BotGame";

const Game = () => {
	return (
		<section className="relative h-screen min-h-[653px] text-white md:min-h-[900px] xl:min-h-[800px]">
			<BotGame />
			{/* <div className="absolute left-[50%] top-[50%] flex min-h-[700px] w-full max-w-[1600px] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center px-4 py-8 lg:flex-row lg:items-end lg:justify-evenly min-[1750px]:h-[900px]"> */}
			{/* <div className="absolute left-[50%] top-[50%] flex min-h-[700px] w-full max-w-[1600px] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center px-4 py-8 lg:flex-row lg:items-end lg:justify-evenly min-[1750px]:h-[900px]">
				<BotGame />
			</div> */}
		</section>
	);
};

export default Game;
