import BotGame from "../../BotGame";

const Game = ({
	params,
}: {
	params: {
		mapIndex: number;
	};
}) => {
	const isValidIndex = /^[0-2]$/.test(String(params.mapIndex));

	return (
		<section className="relative h-screen min-h-[653px] text-white md:min-h-[900px] xl:min-h-[800px]">
			{isValidIndex ? (
				<BotGame mapIndex={Number(params.mapIndex)} />
			) : (
				<h1 className="glassmorphism absolute left-[50%] top-[50%] w-[300px] -translate-x-[50%] -translate-y-[50%] py-3 text-center font-['Whitney_Bold'] text-2xl">
					Invalid Map index!
				</h1>
			)}
		</section>
	);
};

export default Game;
