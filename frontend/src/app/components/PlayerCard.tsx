import Image from "next/image";

type PlayerCardProps = {
	username: string;
	display_name: string;
	img: string;
	additionalStyle: string;
};

const PlayerCard = (props: PlayerCardProps) => {
	return (
		<div
			className={`pointer-events-none h-[180px] w-[180px] overflow-hidden rounded-[40px] p-4 lg:h-[280px] lg:w-[240px] lg:p-0 min-[1750px]:h-[390px] min-[1750px]:w-[370px] ${props.additionalStyle} sm:h-[200px] sm:bg-white`}
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
					{props.username}
				</h3>
				<span className="mt-[-5px] block text-xs lg:text-sm min-[1750px]:text-lg">
					{props.display_name || ""}
				</span>
			</div>
		</div>
	);
};

export default PlayerCard;
