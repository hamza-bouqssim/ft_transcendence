import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBell } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { MenuButton } from "../Buttons";

type Change = {
	menu: boolean;
	onClick: any;
};

const RightFriendsBtn = (props: Change) => {
	
	return (
			
			<div >

				<FontAwesomeIcon
					icon={faChevronDown}
					className={`transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl ${
						props.menu ? "rotate-[180deg]" : "rotate-0"
					}`}
					onClick={props.onClick}
				/>
				<div
					className={`absolute ${
						props.menu ? "flex" : "hidden"
					} right-4 top-14 h-[134px] w-[247px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#8E8E8E] bg-white font-['Whitney_Semibold'] lg:right-[32px] lg:top-[64px]`}
				>
					<MenuButton background={"bg-[#c53939]"} value="View Profile" />
					<MenuButton background={"bg-[#e12222]"} value="Settings" />
				</div>
			</div>
	);
};

export default RightFriendsBtn;
function setCookie(arg0: string, arg1: boolean) {
	throw new Error("Function not implemented.");
}

