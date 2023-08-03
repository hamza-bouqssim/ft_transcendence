import Image from "next/image";

type PlayerProps = {
	name: string,
	username: string,
	img: string,
	direction: string
};

const PlayerCard = (props: PlayerProps) => {
	
	return (
		<div
			className={`pointer-events-none absolute h-[180px] w-[180px] overflow-hidden rounded-[40px] p-4 ${props.direction} sm:h-[200px] sm:bg-white`}
		>
			<div className="m-auto h-[120px] w-[120px] overflow-hidden rounded-[50%] bg-blue-100 sm:h-[130px] sm:w-[130px]">
				<Image
					className="h-full w-full"
					key={0}
					src={props.img}
					width={200}
					height={200}
					alt="user-img"
				/>
			</div>
			<div className="h-full p-2 text-center font-['Whitney_Bold'] leading-[2px] text-white sm:text-black">
				<h3 className="text-sm">{props.name}</h3>
				<span className="text-xs">{props.username}</span>
			</div>
		</div>
	);
};

export default PlayerCard;
