import { useAppSelector } from "@/redux_toolkit/hooks";
import Image from "next/image";

type PlayerCardProps = {
	name: string;
	username: string;
	img: string;
	direction: string;
};

export const PlayerCard = (props: PlayerCardProps) => {
	return (
		<div
			className={`pointer-events-none absolute z-0 h-[180px] w-[180px] overflow-hidden rounded-[40px] p-4 lg:h-[280px] lg:w-[240px] lg:p-0 min-[1750px]:h-[390px] min-[1750px]:w-[370px] ${props.direction} sm:h-[200px] sm:bg-white lg:top-[50%] lg:translate-y-[-50%]`}
		>
			<div className="m-auto h-[120px] w-[120px] overflow-hidden rounded-[50%] bg-blue-100 sm:h-[130px] sm:w-[130px] lg:h-[80%] lg:w-full lg:rounded-[40px]">
				<Image
					className="h-full w-full"
					key={0}
					src={props.img}
					width={200}
					height={200}
					alt="user-img"
				/>
			</div>
			<div className="h-full p-2 text-center font-['Whitney_Bold'] text-white sm:text-black">
				<h3 className="text-sm lg:text-lg min-[1750px]:text-2xl">
					{props.name}
				</h3>
				<span className="mt-[-5px] block text-xs lg:text-sm min-[1750px]:text-lg">
					{props.username}
				</span>
			</div>
		</div>
	);
};

type PlayerScoreProps = {
	flag: string;
	score: number;
	name: string;
	username: string;
	playerBgColor: string;
};

export const PlayerScore = (props: PlayerScoreProps) => {
	return (
		<div
			className={`glassmorphism relative flex h-[225px] w-[390px] flex-col items-center gap-6 px-1 py-3 ${
				props.flag === "right" ? "mb-auto mt-10" : "mb-10 mt-auto"
			}`}
		>
			<div
				className={`flex w-full items-center justify-evenly ${
					props.flag === "right" ? "flex-row-reverse items-end" : ""
				}`}
			>
				<Image
					className={`h-12 w-12 rounded-[50%] border-2 border-[#CFF4FF] shadow-[0_0_50px_2px_var(--blue-color)] md:h-16 md:w-16 min-[1750px]:h-24 min-[1750px]:w-24`}
					style={{ background: props.playerBgColor }}
					id="0"
					src={"/assets/hamza.png"}
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
				className={`w-24 text-center font-['Whitney_Bold'] text-4xl md:text-5xl min-[1750px]:text-7xl`}
			>
				{props.score}
			</div>
		</div>
	);
};
