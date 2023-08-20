"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faComment,
	faGamepad,
	faGear,
	faRightFromBracket,
	faChevronDown,
	faBell,
	faRobot,
	faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { MenuButton } from "../components/Buttons";
import InviteField from "../components/InviteField";
import PlayerCard from "../components/PlayerCard";
import ListItem from "../components/ListItem";

const DashBoard = () => {
	const ulRef = useRef<HTMLUListElement>(null);
	const [change, setChange] = useState<{
		sideBar: boolean;
		chatBox: boolean;
		menu: boolean;
	}>({
		sideBar: false,
		chatBox: false,
		menu: false,
	});

	const handleClick = (e: any): void => {
		const listItems = ulRef.current!.querySelectorAll("li");
		for (let i = 0; i < listItems!.length; i++) {
			listItems[i].classList.remove(
				"translate-x-10",
				"-translate-x-5",
				"text-[--pink-color]",
			);
		}

		e.currentTarget.querySelector("span").textContent === "LogOut"
			? e.currentTarget.classList.add("-translate-x-5", "text-[--pink-color]")
			: e.currentTarget.classList.add("translate-x-10", "text-[--pink-color]");
	};

	return (
		<section className="relative h-[100vh] min-h-[850px] py-4 text-white">
			<aside
				className={`absolute top-0 z-20 h-full w-60 rounded-r-[40px] bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54] pb-20 duration-300 ease-in-out min-[1750px]:left-0 min-[1750px]:w-72 ${
					change.sideBar ? "left-0" : "left-[-240px]"
				}`}
			>
				<ul
					className="relative h-full rounded-tr-[40px] pt-24 font-bold"
					ref={ulRef}
				>
					<FontAwesomeIcon
						icon={faChevronDown}
						className={`fixed left-2 top-5 cursor-pointer rounded-[50%] bg-[--pink-color] p-3 duration-200 ease-in-out hover:bg-[--purple-color] min-[1750px]:hidden
						${change.sideBar ? "left-[190px] rotate-[-270deg]" : "rotate-[270deg]"}`}
						onClick={() =>
							setChange({
								...change,
								sideBar: !change.sideBar,
								chatBox: false,
								menu: false,
							})
						}
					/>
					<ListItem
						icon={faHouse}
						additionalStyle=""
						spanText="Home"
						onClick={handleClick}
					/>
					<ListItem
						icon={faComment}
						additionalStyle=""
						spanText="Chat"
						onClick={handleClick}
					/>
					<ListItem
						icon={faGamepad}
						additionalStyle=""
						spanText="Game"
						onClick={handleClick}
					/>
					<ListItem
						icon={faGear}
						additionalStyle=""
						spanText="Settings"
						onClick={handleClick}
					/>
					<ListItem
						icon={faRightFromBracket}
						additionalStyle="absolute w-full bottom-0"
						spanText="LogOut"
						onClick={handleClick}
					/>
				</ul>
			</aside>

			{/* Top Right Menu */}
			<div className="fixed right-0 z-10 flex h-12 w-64 items-center justify-end gap-2 rounded-l-3xl lg:right-7 min-[1750px]:h-14 min-[1750px]:w-80 min-[1750px]:gap-4">
				<FontAwesomeIcon
					icon={faBell}
					className="left-0 cursor-pointer rounded-[50%] bg-[#ffffff38] p-3 hover:bg-[--pink-color] min-[1750px]:h-6 min-[1750px]:w-6"
				/>
				<div className="flex h-full w-52 items-center justify-between rounded-l-3xl bg-[#ffffff38] pl-1 pr-4 lg:w-56 lg:rounded-3xl min-[1750px]:w-64">
					<Image
						className="h-10 w-10 rounded-[50%] bg-black min-[1750px]:h-12 min-[1750px]:w-12"
						key={0}
						src={"/assets/hamza.png"}
						width={72}
						height={51}
						alt="user"
					/>
					<div className="font-['Whitney_Bold'] leading-3">
						<h6 className="text-sm min-[1750px]:text-lg">Hamza BouQssim</h6>
						<span className="text-xs min-[1750px]:text-sm">@hbouqssi</span>
					</div>

					<FontAwesomeIcon
						icon={faChevronDown}
						className={`transform cursor-pointer text-2xl duration-500 ease-in-out hover:text-[--pink-color] lg:text-3xl ${
							change.menu ? "rotate-[180deg]" : "rotate-0"
						}`}
						onClick={() =>
							setChange({
								...change,
								sideBar: false,
								chatBox: false,
								menu: !change.menu,
							})
						}
					/>
					<div
						className={`absolute ${
							change.menu ? "flex" : "hidden"
						} right-4 top-14 h-[134px] w-[247px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#8E8E8E] bg-white font-['Whitney_Semibold'] lg:right-[32px] lg:top-[64px]`}
					>
						<MenuButton background={"bg-[#d9d9d9]"} value="View Profile" />
						<MenuButton background={"bg-[#BBBBBB]"} value="Settings" />
						<MenuButton background={"bg-[#EA7F87]"} value="Logout" />
					</div>
				</div>
			</div>

			{/* Match Box */}
			<div className="mt-[70px] h-[85%] w-full lg:flex lg:items-center lg:justify-evenly min-[1750px]:ml-72 min-[1750px]:mt-[90px] min-[1750px]:w-[86%]">
				<div className="relative m-auto h-full w-full lg:mx-0 lg:w-[70%]">
					<div className="relative h-[70%] w-full px-2">
						<PlayerCard
							name="Hamza BouQssim"
							username="@hbouqssi"
							img="/assets/hamza.png"
							direction="left-7 top-2"
						/>
						<h3 className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] font-['Whitney_BlackSc'] text-5xl font-bold sm:text-7xl lg:text-8xl min-[1750px]:text-9xl">
							Vs
						</h3>
						<PlayerCard
							name=""
							username=""
							img="/assets/unknown.png"
							direction="right-7 bottom-2"
						/>
					</div>
					<div className="absolute bottom-4 left-[50%] flex h-[25%] w-[200px] translate-x-[-50%] flex-col items-center justify-end gap-4 border-t-2 border-solid border-white py-2">
						<h2 className="w-[280px] text-center font-['Whitney_SemiBold'] text-[20px] min-[1750px]:w-[400px] min-[1750px]:text-2xl">
							Select Bot Opponent or Await Player Joining
						</h2>
						<button className="h-[50px] w-[215px] rounded-[40px] bg-white font-['Whitney_SemiBold'] text-lg font-bold text-black duration-[30ms] ease-in-out hover:bg-[--pink-color] min-[1750px]:text-xl">
							<FontAwesomeIcon icon={faRobot} />
							<span className="ml-2">Play With Bot</span>
						</button>
					</div>
				</div>

				{/* Bottom Invite Box */}
				<div className="fixed bottom-4 right-4 flex w-fit flex-col-reverse items-end gap-4 overflow-hidden lg:relative lg:bottom-0 lg:right-0 lg:h-full lg:w-72 min-[1750px]:w-96">
					<FontAwesomeIcon
						icon={faUserGroup}
						className={`h-[20px] w-[20px] cursor-pointer rounded-[50%] bg-[#ffffff38] p-3 hover:bg-[--pink-color] lg:hidden`}
						onClick={() =>
							setChange({
								...change,
								menu: false,
								sideBar: false,
								chatBox: !change.chatBox,
							})
						}
					/>
					<div
						className={`relative h-64 max-h-80 w-64 overflow-hidden rounded-2xl bg-white lg:absolute lg:block lg:h-full lg:max-h-full lg:w-full ${
							change.chatBox ? "block" : "hidden"
						}`}
					>
						<div className="h-16 rounded-t-xl py-3 min-[1750px]:h-20">
							<h5 className="m-auto w-[80%] rounded-[40px] bg-[#5B8CD4] p-1 text-center font-['Whitney_BlackSC'] text-[22px] min-[1750px]:p-2 min-[1750px]:text-3xl">
								invite a friend
							</h5>
						</div>
						<div className="absolute h-full w-full overflow-y-auto">
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default DashBoard;
