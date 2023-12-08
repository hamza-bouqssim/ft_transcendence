// "use client";
import BotGame from "../../BotGame";

const Game = ({
	params,
}: {
	params: {
		mapIndex: number;
	};
}) => {
	return (
		<section className="relative h-screen min-h-[653px] text-white md:min-h-[900px] xl:min-h-[800px]">
			<BotGame mapIndex={params} />
		</section>
	);
};

export default Game;
