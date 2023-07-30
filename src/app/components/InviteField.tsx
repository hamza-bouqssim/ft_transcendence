import Image from "next/image";

const InviteField = () => {
	return (
		<div className="w-full h-[65px] px-3 rounded-[20px] flex items-center justify-between hover:bg-[#E4E4E4]">
			<div className="bg-black rounded-[50%] w-[60px] h-[90%] ml-[.2rem] mr-6 overflow-hidden shrink-0">
				<Image className="h-full w-full"
					key={0}
					src={'/assets/hamza.png'}
					width={72}
					height={51}
					alt="42logo"
				/>
			</div>
			<div className="font-['Whitney_Bold'] ml-[-80px] text-black"> 
				<h3 className="text-[18px]">Redouan Gatnaou</h3>
				<span className="text-[13px]">@rgatnaou</span>
			</div>
			<button className="w-[80px] h-[36px] bg-[#5B8CD4] rounded-[20px] font-['Whitney_Bold'] hover:bg-[--pink-color]">invite</button>
		</div>
	);
}

export default InviteField;