import OnlineGame from "../../OnlineGame";

const Game = ({
	params,
}: {
	params: {
		mapIndex: number;
	};
}) => {
	return (
		console.log("index map", params),
		(
			<section className="relative h-screen min-h-[653px] text-white md:min-h-[900px] xl:min-h-[800px]">
				<OnlineGame mapIndex={Number(params.mapIndex)} />
			</section>
		)
	);
};

export default Game;
