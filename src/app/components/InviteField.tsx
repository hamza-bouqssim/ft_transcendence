import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

const InviteField = () => {
	return (
		<div className="w-full h-[65px] p-2 rounded-[15px] flex items-center justify-between hover:bg-[#E4E4E4]">
			<div className="bg-black rounded-[50%] w-[50px] h-[50px] ml-[.2rem] overflow-hidden shrink-0">
				<Image className="h-full w-full"
					key={0}
					src={'/assets/hamza.png'}
					width={50}
					height={50}
					alt="42logo"
				/>
			</div>
			<div className="font-['Whitney_Bold'] text-black w-[50%]"> 
				<h3 className="text-sm">Redouan Gatnaou</h3>
				<span className="text-xs">@rgatnaou</span>
			</div>
			{/* <button className="w-[80px] h-[36px] bg-[#5B8CD4] rounded-[20px] font-['Whitney_Bold'] hover:bg-[--pink-color]">invite</button> */}
			<FontAwesomeIcon icon={faUserPlus} className="bg-[#5B8CD4] rounded-[50%] p-3 w-5 h-5 hover:bg-[--pink-color] hover:cursor-pointer" />
		</div>
	);
}

export default InviteField;