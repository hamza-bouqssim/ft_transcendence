import Image from "next/image";

const PlayerCard = (props: any) => {
	return (
		<div className="w-[365px] h-[464px] bg-white rounded-[40px] overflow-hidden pointer-events-none">
			<div className="bg-blue-100 rounded-[40px] overflow-hidden">
				<Image className="w-full"
					key={0}
					src={props.img}
					width={72}
					height={51}
					alt="img"
				/>
			</div>
			<div className="h-full text-center p-2 text-black font-['Whitney_Bold']"> 
				<h3 className="text-[30px]">{props.name}</h3>
				<span className="text-[20px]">{props.username}</span>
			</div>
		</div>
	);
}

export default PlayerCard;