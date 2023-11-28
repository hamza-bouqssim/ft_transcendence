import { Page } from "@/app/utils/styles";
import BotGame from "./BotGame";

const Game = () => {
	return (
		<section className="relative h-[100vh] min-h-[850px] py-4 text-white">
			<div className="fixed left-[50%] top-[50%] flex h-[700px] w-full max-w-[1600px] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center px-4 py-8 lg:flex-row lg:items-end lg:justify-evenly min-[1750px]:h-[900px]">
				<BotGame />
			</div>
		</section>
	);
};

export default Game;
// Game.getLayout = (page: any) => {
// 	return { page };
// };