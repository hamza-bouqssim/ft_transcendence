import OnlineGame from "../../../OnlineGame";

const Game = ({
	params,
}: {
	params: {
		mapIndex: number;
	};
}) => {
	return <OnlineGame mapIndex={Number(params.mapIndex)} />;
};

export default Game;
