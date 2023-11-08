"use client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faComment,
	faGamepad,
	faGear,
	faRightFromBracket,
	faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import ListItem from "./ListItem";
import { useRef, useState } from "react";
import Link from "next/link";

type Change = {
	sideBar: boolean;
	onClick: any;
};

const SideBar = (props: Change) => {
	const ulRef = useRef<HTMLUListElement>(null);


	const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);

	const messageBox = (): boolean => {
		const MySwal = withReactContent(Swal);

		MySwal.fire({
			title: "Are You Sure?",
			color: "#ffff",
			icon: "question",
			iconColor: "#498cda",
			showCancelButton: true,
			background: "#2E2F54",
			confirmButtonColor: "#fc7785",
			cancelButtonColor: "#6a67f3",
			confirmButtonText: "Yes, Log Out!",
			customClass: "rounded-[30px] font-['Whitney_BlackSc'] text-sm",
		}).then((result) => {
			if (result.isConfirmed) return true;
		});
		return false;
	};

	return (
		<aside
			className={` z-20 h-full  bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54]  text-white duration-300 ease-in-out flex flex-col items-center justify-between`}
		>
			<ul
				className=" h-full  font-bold"
				ref={ulRef}
			>
				{/* <FontAwesomeIcon
					icon={faChevronDown}
					className={`fixed left-2 top-5 cursor-pointer rounded-[50%] bg-[--pink-color] p-3 duration-200 ease-in-out hover:bg-[--purple-color] 
				${props.sideBar ? "left-[230px] rotate-[-270deg]" : "rotate-[270deg]"}`}
					onClick={props.onClick}
				/> */}
				<ListItem
					icon={faHouse}
					additionalStyle=""
					spanText="Home"
					
				/>
				<Link href={"/dashboard/chat"}>
				<ListItem
					icon={faComment}
					additionalStyle=""
					spanText="Chat"
					
				/>
				</Link>
				<Link href={"/dashboard/game"}>
					<ListItem
						icon={faGamepad}
						additionalStyle=""
						spanText="Game"
						
					/>
				</Link>
				<Link href={"/dashboard/settings"}>
					<ListItem
						icon={faGear}
						additionalStyle=""
						spanText="Settings"
						
					/>
				</Link>
			</ul>
			<ul>
				<Link
					href={"/"}
					onClick={(e) => {
						if (!messageBox()) e.preventDefault();
					}}
				>
					<ListItem
						icon={faRightFromBracket}
						additionalStyle=" w-full"
						spanText="LogOut"
						
					/>
				</Link>
			</ul>
		</aside>
	);
};

export default SideBar;