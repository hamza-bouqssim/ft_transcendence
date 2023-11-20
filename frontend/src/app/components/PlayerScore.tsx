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
		<div
			className={`glassmorphism relative flex h-[225px] w-[390px] flex-col items-center gap-6 px-1 py-3 ${
				props.flag === "right" ? "mb-auto mt-10" : "mb-10 mt-auto"
			}`}
		>
			<div
				className={`${
					props.startGame ? "visible" : "invisible"
				} flex w-full items-center justify-evenly ${
					props.flag === "right" ? "flex-row-reverse items-end" : ""
				}`}
			>
				<Image
					className={`h-12 w-12 rounded-[50%] border-2 border-[#CFF4FF] shadow-[0_0_50px_2px_var(--blue-color)] md:h-16 md:w-16 min-[1750px]:h-24 min-[1750px]:w-24`}
					style={{ background: props.playerBgColor }}
					id="0"
					src={props.isBotPlayer ? "/assets/bot.png" : "/assets/hamza.png"}
					width={40}
					height={40}
					alt="player"
				/>

				<div
					className={`font-['Whitney_Bold'] text-white ${
						props.flag === "right" ? "right-32 text-right" : "left-32"
					}`}
				>
					<h3 className="text-sm md:text-lg min-[1750px]:text-3xl">
						{props.name}
					</h3>
					<span
						className={`mt-[-5px] block text-xs lg:text-sm min-[1750px]:text-xl`}
					>
						{props.username}
					</span>
				</div>
			</div>

			<div
				className={`${
					props.startGame ? "visible" : "invisible"
				} w-24 text-center font-['Whitney_Bold'] text-4xl md:text-5xl min-[1750px]:text-7xl`}
			>
				{props.score}
			</div>
		</div>
	);
};

export default PlayerScore;
