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
		// <div
		// 	className={`flex h-full w-[48%] items-center justify-between ${
		// 		props.flag === "right" ? "flex-row-reverse" : ""
		// 	}`}
		// >
		// 	<Image
		// 		className={`h-16 w-16 rounded-[50%] border-2 border-[#CFF4FF] shadow-[0_0_50px_2px_var(--blue-color)]`}
		// 		style={{ background: props.playerBgColor }}
		// 		id="0"
		// 		src={"/assets/hamza.png"}
		// 		width={40}
		// 		height={40}
		// 		alt="player"
		// 	/>
		// 	<div
		// 		className={`font-['Whitney_Bold'] text-white ${
		// 			props.flag === "right" ? "-mr-6" : "-ml-6"
		// 		}`}
		// 	>
		// 		<h3 className="text-sm lg:text-lg min-[1750px]:text-2xl">
		// 			{props.name}
		// 		</h3>
		// 		<span
		// 			className={`mt-[-5px] block text-xs lg:text-sm min-[1750px]:text-lg ${
		// 				props.flag === "right" ? "text-right" : ""
		// 			}`}
		// 		>
		// 			{props.username}
		// 		</span>
		// 	</div>
		// 	<div className={`w-24 text-center font-['Whitney_Bold'] text-5xl`}>
		// 		{props.score}
		// 	</div>
		// </div>
		<div
			className={`relative flex h-full w-[48%] flex-col justify-around px-1 py-3 min-[379px]:px-4 md:flex-row md:items-center`}
		>
			<div
				className={`flex items-center justify-between md:w-full ${
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
					className={`w-24 text-center font-['Whitney_Bold'] text-4xl md:text-5xl min-[1750px]:text-7xl`}
				>
					{props.score}
				</div>
			</div>
			<div
				className={`font-['Whitney_Bold'] text-white md:absolute ${
					props.flag === "right"
						? "text-right md:right-24 min-[1750px]:right-32"
						: "md:left-24 min-[1750px]:left-32"
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
	);
};
