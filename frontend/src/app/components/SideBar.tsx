"use client";
import {
	faHouse,
	faComment,
	faGamepad,
	faGear,
	faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import ListItem from "./ListItem";
import { useRef } from "react";
import Link from "next/link";
import LogOut from "./LogOut";

type Change = {
	sideBar: boolean;
	onClick: any;
};

const SideBar = (props: Change) => {
	const ulRef = useRef<HTMLUListElement>(null);

	return (
		<aside
			className={`fixed bottom-0 left-0 right-0 z-20 flex justify-between  bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54]  text-white duration-300 ease-in-out md:relative md:h-full md:flex-col md:items-center`}
		>
			<ul
				className="flex h-full w-full justify-between font-bold md:w-auto md:flex-col md:justify-start"
				ref={ulRef}
			>
				<Link href={"/dashboard"}>
					<ListItem icon={faHouse} additionalStyle="" spanText="Home" />
				</Link>
				<Link href={"/dashboard/chat"}>
					<ListItem icon={faComment} additionalStyle="" spanText="Chat" />
				</Link>
				<Link href={"/dashboard/game"}>
					<ListItem icon={faGamepad} additionalStyle="" spanText="Game" />
				</Link>
				<Link href={"/dashboard/settings"}>
					<ListItem icon={faGear} additionalStyle="" spanText="Settings" />
				</Link>
				<Link className="hidden md:block" href={"#"} onClick={LogOut}>
					<ListItem
						icon={faRightFromBracket}
						additionalStyle="absolute w-full bottom-0"
						spanText="LogOut"
					/>
				</Link>
			</ul>
		</aside>
	);
};

export default SideBar;
