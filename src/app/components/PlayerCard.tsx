import Image from "next/image";

const PlayerCard = (props: any) => {
	return (
		<div className={`absolute w-[180px] h-[180px] p-4 rounded-[40px] overflow-hidden pointer-events-none ${props.direction} sm:bg-white sm:h-[200px]`}>
			<div className="bg-blue-100 rounded-[50%] overflow-hidden w-[120px] h-[120px] m-auto sm:w-[130px] sm:h-[130px]">
				<Image className="w-full h-full"
					key={0}
					src={props.img}
					width={200}
					height={200}
					alt="user-img"
				/>
			</div>
			<div className="h-full text-center p-2 text-white font-['Whitney_Bold'] leading-[2px] sm:text-black"> 
				<h3 className="text-sm">{props.name}</h3>
				<span className="text-xs">{props.username}</span>
			</div>
		</div>
	);
}

export default PlayerCard;