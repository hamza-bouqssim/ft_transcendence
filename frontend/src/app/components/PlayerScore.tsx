type PlayerScoreProps = {
	flag: string;
	color: string;
	
	score: number;
};

const PlayerScore = (props: PlayerScoreProps) => {
	return (
		<div
			style={{ color: props.color }}
			className={`score-box flex h-1/2 w-full items-center ${
				props.flag === "top" ? "justify-end" : ""
			} px-2 font-['Whitney_Semibold'] `}
		>
			{props.score}
		</div>
	);
};



export default PlayerScore;
