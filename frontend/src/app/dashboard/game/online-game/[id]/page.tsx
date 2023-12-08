"use client";
import OnlineGame from "./OnlineGame";
import ChooseMap from "../../choose-map/page";

const Game = () => {
	return (
		<section className="relative h-screen min-h-[653px] text-white md:min-h-[900px] xl:min-h-[800px]">
			{/* <ChooseMap/> */}
			<OnlineGame />
		</section>
	);
};

export default Game;
