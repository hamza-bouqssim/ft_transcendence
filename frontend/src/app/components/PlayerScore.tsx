import Image from "next/image";

type PlayerScoreProps = {
	flag: string;
	score: number;
	name: string;
	username: string;
	playerBgColor: string;
	isBotPlayer: boolean;
	startGame: boolean;
};

const PlayerScore = (props: PlayerScoreProps) => {
	return (
		// <div
		// 	className={`relative flex h-[64px] w-[96%] items-center bg-red-500 xl:h-[225px] xl:w-[390px] xl:flex-col xl:gap-6 xl:px-1 xl:py-3 ${
		// 		props.flag === "right"
		// 			? "ml-auto mr-0 xl:mb-auto xl:mt-10"
		// 			: "ml-0 mr-auto xl:mb-10 xl:mt-auto"
		// 	}`}
		// >
		<div
			className={`glassmorphism relative flex h-[64px] w-[96%] max-w-[300px] items-center md:h-[110px] md:max-w-[450px] xl:h-[190px] xl:max-w-[300px] xl:flex-col xl:gap-6 xl:px-1 xl:py-3 min-[1750px]:h-[230px] min-[1750px]:max-w-[400px] ${
				props.flag === "top"
					? "ml-auto mr-0 flex-row-reverse xl:mb-auto xl:mt-10 min-[1750px]:mt-20"
					: "ml-0 mr-auto xl:mb-10 xl:mt-auto min-[1750px]:mb-20"
			}`}
		>
			<div
				className={`${
					props.startGame ? "visible" : "invisible"
				} flex w-[60%] items-center gap-4 xl:w-full ${
					props.flag === "top" ? "flex-row-reverse pr-2" : "pl-2"
				}`}
			>
				<Image
					className={`h-12 w-12 rounded-[50%] border-2 border-[#CFF4FF] shadow-[0_0_50px_2px_var(--blue-color)] md:h-20 md:w-20 min-[1750px]:h-24 min-[1750px]:w-24`}
					style={{ background: props.playerBgColor }}
					id="0"
					src={props.isBotPlayer ? "/assets/bot.png" : "/assets/hamza.png"}
					width={40}
					height={40}
					alt="player"
				/>

				<div
					className={`font-['Whitney_Bold'] text-white ${
						props.flag === "top" ? "right-32 text-right" : "left-32"
					}`}
				>
					<h3 className="text-sm md:text-xl xl:text-xl min-[1750px]:text-3xl">
						{props.name}
					</h3>
					<span
						className={`mt-[-5px] block text-xs md:text-sm lg:text-sm min-[1750px]:text-xl`}
					>
						{props.username}
					</span>
				</div>
			</div>

			<div
				className={`${
					props.startGame ? "visible" : "invisible"
				} w-[40%] text-center font-['Whitney_Bold'] text-2xl md:text-5xl xl:w-full xl:text-5xl min-[1750px]:text-6xl`}
			>
				{props.score}
			</div>
		</div>
	);
};

export default PlayerScore;
