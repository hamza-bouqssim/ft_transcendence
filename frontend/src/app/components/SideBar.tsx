"use client";
import {
	faHouse,
	faComment,
	faGamepad,
	faGear,
	faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import ListItem from "./ListItem";
import Link from "next/link";
import LogOut from "./LogOut";
import { usePathname } from "next/navigation";
import { useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const SideBar = () => {
	const pathName = usePathname();
	const items = [
		{
			href: "/dashboard",
			icon: faHouse,
			spanText: "Home",
			condition: pathName.endsWith("/dashboard")
				? "bg-[--pink-color] animate-wiggle"
				: "",
		},
		{
			href: "/dashboard/chat",
			icon: faComment,
			spanText: "Chat",
			condition:
				pathName.endsWith("/chat") || pathName.endsWith("/groups")
					? "bg-[--pink-color] animate-wiggle"
					: "",
		},
		{
			href: "/dashboard/game",
			icon: faGamepad,
			spanText: "Game",
			condition: pathName.includes("/game")
				? "bg-[--pink-color] animate-wiggle"
				: "",
		},
		{
			href: "/dashboard/settings",
			icon: faGear,
			spaneText: "Settings",
			condition: pathName.endsWith("/settings")
				? "bg-[--pink-color] animate-wiggle"
				: "",
		},
	];

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
			className={`fixed bottom-0 left-0 right-0 z-20 flex justify-between bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54]  text-white duration-300 ease-in-out md:relative md:h-full md:flex-col md:items-center`}
		>
			<ul className="flex h-full w-full justify-between font-bold md:w-auto md:flex-col md:justify-start">
				{items.map((el: any, index: number) => (
					<Link href={el.href} key={index}>
						<ListItem
							icon={el.icon}
							spanText={el.icon}
							additionalStyle={el.condition}
						/>
					</Link>
				))}

				<Link className="hidden md:block" href={"#"} onClick={LogOut}>
					<ListItem
						icon={faRightFromBracket}
						spanText="LogOut"
						additionalStyle="absolute w-full bottom-0"
					/>
				</Link>
			</ul>
		</aside>
	);
};

export default SideBar;
