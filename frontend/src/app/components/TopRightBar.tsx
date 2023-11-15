import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBell } from "@fortawesome/free-solid-svg-icons";
import { LogoutButton, MenuButton } from "./Buttons";
import { useEffect, useState } from "react";
import { getAuthUser, getlogout } from "../utils/api";
import { User } from "../utils/types";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

type Change = {
	menu: boolean;
	onClick: any;
};

const TopRightBar = (props: Change) => {
	const [ user, setUser] = useState<User | undefined>();

    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        setLoading(true);
        getAuthUser().then(({data}) => {
            setUser(data);
        }).catch((err)=> {console.log(err);});
    }, [])
	const router = useRouter();

	const logout =  () =>{
		try {
			getlogout();
			deleteCookie('logged');
			router.push("/", { scroll: false });
		} catch (err) {
			alert("failed to logout");
			// console.log(err);
		}
	}
	return (
		<div className="fixed right-0 z-10 flex h-12 w-64 items-center justify-end gap-2 rounded-l-3xl lg:right-7 min-[1750px]:h-14 min-[1750px]:w-80 min-[1750px]:gap-4">
			<FontAwesomeIcon
				icon={faBell}
				className="left-0 cursor-pointer rounded-[50%] bg-[#ffffff38] p-3 hover:bg-[--pink-color] min-[1750px]:h-6 min-[1750px]:w-6"
			/>
			<div className="flex h-full w-52 items-center justify-between rounded-l-3xl bg-[#ffffff38] pl-1 pr-4 lg:w-56 lg:rounded-3xl min-[1750px]:w-64">
			{user && user.avatar_url && (
  				<Image
    				className="h-10 w-10 rounded-[50%] bg-black min-[1750px]:h-12 min-[1750px]:w-12"
    				key={0}
    				src={"/assets/user2.jpeg"}
    				width={72}
    				height={51}
    				alt="user"
  					
					/>
)}
				<div className="font-['Whitney_Bold'] leading-3">
					<h6 className="text-sm min-[1750px]:text-lg">{user?.display_name}</h6>
					<span className="text-xs min-[1750px]:text-sm">{user?.username}</span>
				</div>

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
					<MenuButton background={"bg-[#d9d9d9]"} value="View Profile" />
					<MenuButton background={"bg-[#BBBBBB]"} value="Settings" />
					<LogoutButton  background={"bg-[#EA7F87]"} value="Logout" />
				</div>
			</div>
		</div>
	);
};

export default TopRightBar;
function setCookie(arg0: string, arg1: boolean) {
	throw new Error("Function not implemented.");
}

