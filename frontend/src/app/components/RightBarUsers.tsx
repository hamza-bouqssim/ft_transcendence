import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBell } from "@fortawesome/free-solid-svg-icons";
import { GoToProfileBtn, LogoutButton, MenuButton } from "./Buttons";
import { useEffect, useState } from "react";
import { getAuthUser, getlogout } from "../utils/api";
import { User } from "../utils/types";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

type Change = {
	menu: boolean;
	onClick: any;
};

const RightBarUsers = (props: Change) => {
	return (
		<div>
			<FontAwesomeIcon
				icon={faChevronDown}
				className={`} transform cursor-pointer  text-black`}
				onClick={props.onClick}
			/>
			<div
				className={`absolute ${
					props.menu ? "flex" : "hidden"
				}  h-[134px] w-[247px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#8E8E8E] bg-white font-['Whitney_Semibold'] lg:right-[32px] lg:top-[64px]`}
			>
				<GoToProfileBtn background={"bg-[#d9d9d9]"} value="View Profile" />
				<MenuButton background={"bg-[#BBBBBB]"} value="Send Message" />
			</div>
		</div>
	);
};

export default RightBarUsers;
function setCookie(arg0: string, arg1: boolean) {
	throw new Error("Function not implemented.");
}
