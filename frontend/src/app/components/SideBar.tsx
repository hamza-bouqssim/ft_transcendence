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
import { useContext,  useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { socketContext } from "../utils/context/socketContext";

const SideBar = () => {
	const pathName = usePathname();
	const {isMessage} = useContext(socketContext)
	
	const items = [
		{
			href: "/dashboard",
			icon: faHouse,
			spanText: "Home",
			condition: pathName.endsWith("/dashboard")
				? "text-[--pink-color] animate-pulse"
				: "",
		},
		{
			href: "/dashboard/chat",
			icon: faComment,
			spanText: "Chat",
			condition:
				pathName.endsWith("/chat") || pathName.endsWith("/groups")
					? "text-[--pink-color] animate-pulse"
					: "",
			notification: isMessage,
		},
		{
			href: "/dashboard/game",
			icon: faGamepad,
			spanText: "Game",
			condition: pathName.includes("/game")
				? "text-[--pink-color] animate-pulse"
				: "",
		},
		{
			href: "/dashboard/settings",
			icon: faGear,
			spanText: "Settings",
			condition: pathName.endsWith("/settings")
				? "text-[--pink-color] animate-pulse"
				: "",
		},
	];
	const {socket} = useContext(socketContext);

	const hanldeLogOut = () =>{
		const ret : boolean | null = LogOut();
		if (ret == true)
			socket.disconnect();
	}

	const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);
	const {notificationChat} = useSelector((state:any) => state.NotificationChat);
	const {notificationRoom} = useSelector((state:any) => state.NotificationChat);
	
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
              spanText={el.spanText}
              additionalStyle={""}
              iconColor={el.condition}
            />
          </Link>
        ))}

        <Link className="hidden md:block" href={"#"} onClick={hanldeLogOut}>
          <ListItem
            icon={faRightFromBracket}
            spanText="LogOut"
            additionalStyle="absolute w-full bottom-0"
            iconColor={""}
          />
        </Link>
      </ul>
    </aside>
  );
};

export default SideBar;
