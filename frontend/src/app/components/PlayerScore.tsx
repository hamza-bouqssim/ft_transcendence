type PlayerScoreProps = {
	flag: string;
	// userName: string;
	// displayName: string;
	color: string;
	// profileImage: any;
	// startGame: boolean;
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

// const PlayerScore = (props: PlayerScoreProps) => {
// 	return (
// 		<div
// 			className={`glassmorphism relative flex h-[64px] w-[96%] max-w-[300px] items-center md:h-[110px] md:max-w-[450px] xl:h-[190px] xl:max-w-[300px] xl:flex-col xl:gap-6 xl:px-1 xl:py-3 min-[1750px]:h-[230px] min-[1750px]:max-w-[400px] ${
// 				props.flag === "top"
// 					? "ml-auto mr-0 flex-row-reverse xl:mb-auto xl:mt-10 min-[1750px]:mt-20"
// 					: "ml-0 mr-auto xl:mb-10 xl:mt-auto min-[1750px]:mb-20"
// 			}`}
// 			style={{ border: `solid 4px ${props.color}` }}
// 		>
// 			<div
// 				className={`${
// 					props.startGame ? "visible" : "invisible"
// 				} flex w-[60%] items-center gap-4 xl:w-full ${
// 					props.flag === "top" ? "flex-row-reverse pr-2" : "pl-2"
// 				}`}
// 			>
// 				<Image
// 					className={`h-12 w-12 rounded-[50%] border-2 border-[#CFF4FF] shadow-[0_0_50px_2px_var(--blue-color)] md:h-20 md:w-20 min-[1750px]:h-24 min-[1750px]:w-24`}
// 					style={{ background: props.color }}
// 					id="0"
// 					src={props.profileImage || "/assets/unknown.png"}
// 					width={40}
// 					height={40}
// 					alt="player"
// 				/>

// 				<div
// 					className={`font-['Whitney_Bold'] text-white ${
// 						props.flag === "top" ? "right-32 text-right" : "left-32"
// 					}`}
// 				>
// 					<h3 className="text-sm md:text-xl xl:text-xl min-[1750px]:text-3xl">
// 						{props.userName}
// 					</h3>
// 					<span
// 						className={`mt-[-5px] block text-xs md:text-sm lg:text-sm min-[1750px]:text-xl`}
// 					>
// 						{"@" + props.displayName}
// 					</span>
// 				</div>
// 			</div>

// 			<div
// 				className={`${
// 					props.startGame ? "visible" : "invisible"
// 				} w-[40%] text-center font-['Whitney_Bold'] text-2xl md:text-5xl xl:w-full xl:text-5xl min-[1750px]:text-6xl`}
// 			>
// 				{props.score}
// 			</div>
// 		</div>
// 	);
// };

export default PlayerScore;
