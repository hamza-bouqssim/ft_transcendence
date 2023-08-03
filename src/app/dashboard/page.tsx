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
	faBars,
	faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { MenuButton } from "../components/Buttons";
import InviteField from "../components/InviteField";
import PlayerCard from "../components/PlayerCard";

const DashBoard = () => {
	const [change, setChange] = useState<{
		sideBar: boolean;
		chatBox: boolean;
		menu: boolean;
	}>({
		sideBar: false,
		chatBox: false,
		menu: false,
	});
	// let [lastTarget, setLastTarget] = useState<HTMLDivElement | null>(null);
	const parentRef = useRef<HTMLUListElement>(null),
		barRef = useRef<HTMLDivElement>(null);

	let getLastTarget: HTMLLIElement | null;

	// useEffect(() => {
	// 	lastTarget = barRef.current!.parentNode as HTMLDivElement;
	// }, [barRef.current]);
	useEffect(() => {
		getLastTarget = barRef.current!.parentNode as HTMLLIElement;
	}, [barRef.current]);

	const handleClick = (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>,
	): void => {
		const firstLiTopValue = 187;

		// barRef.current!.style.top = `${(e.currentTarget.getBoundingClientRect().top + (lastTarget!.getBoundingClientRect().height / 2)) - firstLiTopValue}px`;
		// console.log(lastTarget!.getBoundingClientRect().height);
		barRef.current!.style.top = `${
			e.currentTarget.getBoundingClientRect().top + 49 - firstLiTopValue
		}px`;
		if (getLastTarget) getLastTarget.style.color = "rgba(255,255,255,0.5)";
		e.currentTarget.style.color = "white";
		getLastTarget = e.currentTarget;
		// setLastTarget(e.currentTarget);
	};

	return (
		// <section className={`bg-[url('/assets/dashboard.svg')] ${ window.innerHeight < 830 ? 'h-[830px]' : 'h-[100vh]' } bg-cover bg-[#1E1B36] flex items-center text-white`}>
		// <aside className="py-10 w-[123px] h-[100vh] bg-gradient-to-b from-[#5b8cd454] via-[#5b8bd454] to-[#35375f] rounded-r-[40px] flex flex-col items-center gap-24 shadow-[1px_1px_6px_1px_rgba(0,0,0,0.40)]"> */}
		<section className="fixed h-[100vh] w-full overflow-y-auto bg-[#1E1B36] bg-[url('/assets/dashboard.svg')] bg-cover bg-fixed text-white">
			<div className="relative h-full min-h-[830px] py-8">
				<aside
					className={`absolute z-10 mt-[-32px] h-full py-10 ${
						change.sideBar ? "pointer-events-auto ml-0" : "ml-[-85%]"
					} z-30 flex w-[85%] flex-col items-center gap-24 rounded-r-[40px] bg-gradient-to-b from-[#2E2F54] via-[#3B5282] to-[#2E2F54] shadow-[1px_1px_6px_1px_rgba(0,0,0,0.40)] duration-300 ease-in-out`}
				>
					<FontAwesomeIcon
						icon={faChevronDown}
						className={`pointer-events-auto fixed top-9 z-20 h-[25px] w-[25px] transform cursor-pointer rounded-[50%] bg-[--pink-color] p-2 duration-300 ease-in-out ${
							change.sideBar
								? "left-[80%] rotate-[90deg]"
								: "left-[-12px] rotate-[-90deg]"
						} xl:hidden`}
						onClick={() =>
							setChange({
								...change,
								menu: false,
								chatBox: false,
								sideBar: !change.sideBar,
							})
						}
					/>
					{/* <div>
						<Image className="mix-blend-lighten"
							key={0}
							src={'/assets/42-dash.svg'}
							width={72}
							height={51}
							alt="42logo"
						/>
					</div> */}
					<div className="h-[50px] w-[50px]">
						<Image
							className="mix-blend-lighten"
							key={0}
							src={"/assets/42-dash.svg"}
							width={50}
							height={50}
							alt="42logo"
						/>
					</div>
					<ul className="relative h-full w-full" ref={parentRef}>
						<li
							className="li-style group relative text-white"
							onClick={(e) => handleClick(e)}
						>
							<div
								ref={barRef}
								className="absolute right-0 top-[50%] h-[50px] translate-y-[-50%] rounded-xl border-[3px] border-solid border-white duration-150 ease-linear"
							></div>
							<div className="flex items-center pl-[10%]">
								<FontAwesomeIcon icon={faHouse} className="icon-aside-bar" />
								<span className="ml-10 text-xl">Home</span>
							</div>
						</li>
						<li
							className="li-style group text-[rgba(255,255,255,.5)]"
							onClick={(e) => handleClick(e)}
						>
							<div className="flex items-center pl-[10%] ">
								<FontAwesomeIcon icon={faComment} className="icon-aside-bar" />
								<span className="ml-10 text-xl">Chat</span>
							</div>
						</li>
						<li
							className="li-style group text-[rgba(255,255,255,.5)]"
							onClick={(e) => handleClick(e)}
						>
							<div className="flex items-center pl-[10%]">
								<FontAwesomeIcon icon={faGamepad} className="icon-aside-bar" />
								<span className="ml-10 text-xl">Game</span>
							</div>
						</li>
						<li
							className="li-style group text-[rgba(255,255,255,.5)]"
							onClick={(e) => handleClick(e)}
						>
							<div className="flex items-center pl-[10%]">
								<FontAwesomeIcon icon={faGear} className="icon-aside-bar" />
								<span className="ml-10 text-xl">Settings</span>
							</div>
						</li>
						<li className="li-style group absolute bottom-0 w-full ">
							<div className="flex items-center pl-[15%]">
								<FontAwesomeIcon
									icon={faRightFromBracket}
									className="icon-aside-bar rotate-[-180deg] transform"
								/>
								<span className="ml-10 text-xl">LogOut</span>
							</div>
						</li>
					</ul>
				</aside>

				<div className="fixed z-10 flex w-full flex-wrap items-center justify-end gap-4 lg:gap-10">
					<div className="relative h-[45px] w-[45px] shrink-0 cursor-pointer rounded-[50%] bg-[rgba(255,255,255,0.22)] hover:bg-[--pink-color] lg:h-[64px] lg:w-[64px]">
						<FontAwesomeIcon
							icon={faBell}
							className="absolute left-[50%] top-[50%] h-[20px] w-[20px] translate-x-[-50%] translate-y-[-50%]"
						/>
					</div>

					{/* Top Right Menu===================================================Begin */}
					<div className="relative right-0 flex h-[50px] w-[180px] items-center rounded-l-[93px] bg-[#ffffff38] lg:right-4 lg:h-[69px] lg:w-[376px] lg:rounded-[93px]">
						<div className="ml-[.2rem] mr-3 h-[90%] shrink-0 overflow-hidden rounded-[50%] bg-black lg:mr-6 lg:h-[64px]">
							<Image
								className="h-full w-full mix-blend-lighten"
								key={0}
								src={"/assets/hamza.png"}
								width={72}
								height={51}
								alt="user"
							/>
						</div>
						<div className="font-['Whitney_Bold']">
							<h3 className="text-sm lg:text-[20px]">Hamza BouQssim</h3>
							<span className="text-xs lg:text-[15px]">@hbouqssi</span>
						</div>
						<div className="group absolute right-8 mr-[-18px] mt-[22px] cursor-pointer lg:mt-0">
							<FontAwesomeIcon
								icon={faChevronDown}
								className={` transform text-2xl duration-500 ease-in-out group-hover:text-[--pink-color] lg:text-3xl ${
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
						</div>
					</div>
					{/* Top Right Menu===================================================End */}

					<div
						className={`absolute ${
							change.menu ? "flex" : "hidden"
						} right-[18px] top-[64px] h-[134px] w-[247px] flex-col items-center justify-center gap-1 rounded-[15px] border-2 border-solid border-[#8E8E8E] bg-white font-['Whitney_Semibold'] lg:right-[32px] lg:top-[64px]`}
					>
						<MenuButton background={"bg-[#d9d9d9]"} value="View Profile" />
						<MenuButton background={"bg-[#BBBBBB]"} value="Settings" />
						<MenuButton background={"bg-[#EA7F87]"} value="Logout" />
					</div>
				</div>

				{/* Match Box===================================================Begin */}
				<div className="relative m-auto lg:ml-0 mt-[70px] h-[85%] w-[85%] bg-red-400 lg:w-[60%]">
					<div className="relative h-[70%] w-full px-2">
						<PlayerCard
							name="Hamza BouQssim"
							username="@hbouqssi"
							img="/assets/hamza.png"
							direction="top-2"
						/>
						<h3 className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] font-['Whitney_BlackSc'] text-5xl font-bold sm:text-7xl">
							Vs
						</h3>
						<PlayerCard
							name=""
							username=""
							img="/assets/unknown.png"
							direction="right-2 bottom-2"
						/>
					</div>

					<div className="absolute bottom-4 left-[50%] flex h-[25%] w-[200px] translate-x-[-50%] flex-col items-center justify-end gap-4 border-t-2 border-solid border-white py-2">
						<h2 className="min-w-[280px] text-center font-['Whitney_SemiBold'] text-[20px]">
							Select Bot Opponent or Await Player Joining
						</h2>
						<button className="h-[50px] w-[215px] rounded-[40px] bg-white font-['Whitney_SemiBold'] text-lg font-bold text-black duration-[30ms] ease-in-out hover:bg-[--pink-color]">
							<FontAwesomeIcon icon={faRobot} />
							<span className="ml-2">Play With Bot</span>
						</button>
					</div>
				</div>
				{/* Match Box===================================================End */}

				{/* Invite Box===================================================Begin */}
				<FontAwesomeIcon
					icon={faUserGroup}
					className={`fixed bottom-4 right-4 h-[20px] w-[20px] cursor-pointer rounded-[50%] bg-[#ffffff38] p-3 hover:bg-[--pink-color] lg:hidden`}
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
					className={`fixed h-[360px] w-[85%] max-w-[350px] rounded-[20px] bg-white px-4 py-6 lg:h-[70%] ${
						window.innerWidth >= 1024 ? setChange({...change, chatBox: true}) : "",
						(change.chatBox ) ? "flex" : "hidden"
					} bottom-[80px] right-4 flex-col items-center gap-5`}
				>
					<div className="h-[54px] w-[80%] rounded-[40px] bg-[#5B8CD4] text-center font-['Whitney_BlackSC'] text-[25px]">
						invite a friend
					</div>
					<div className="flex h-full w-full flex-col gap-4 overflow-y-auto ">
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
				{/* Invite Box===================================================End */}
			</div>

			{/* <div className="w-full h-[100vh] p-10">
				<div className="flex items-center justify-end gap-10">
					<div className="relative group w-[64px] h-[64px] bg-[rgba(255,255,255,0.22)] rounded-[50%] cursor-pointer">
						<FontAwesomeIcon icon={faBell} className="text-3xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] group-hover:text-[--pink-color]" />
					</div>
// this
					<div className="relative bg-[#ffffff38] flex items-center w-[376px] h-[69px] rounded-[93px]">
						<div className="bg-black rounded-[50%] w-[64px] h-[64px] ml-[.2rem] mr-6 overflow-hidden">
							<Image className="mix-blend-lighten h-full w-full"
								key={0}
								src={'/assets/hamza.png'}
								width={72}
								height={51}
								alt="42logo"
							/>
						</div>
						<div className="font-['Whitney_Bold']"> 
							<h3 className="text-[20px]">Hamza BouQssim</h3>
							<span className="text-[15px]">@hbouqssi</span>
						</div>
						<div className="absolute group right-8 cursor-pointer">
							<FontAwesomeIcon icon={faChevronDown} className="text-3xl ease-in-out duration-500 group-hover:text-[--pink-color]"
											onClick={(e) => {
														change ? (e.currentTarget.style.transform = "rotate(180deg)") : (e.currentTarget.style.transform = "rotate(0)");
														setChange(!change)
													}
												} />
						</div>
						<div className={`absolute ${!change ? '' : 'custom-hidden'} w-[247px] h-[134px] bg-white top-[64px] right-[32px] rounded-[15px] flex items-center justify-center flex-col gap-1 font-['Whitney_Semibold'] border-2 border-solid border-[#8E8E8E]`}>
							<MenuButton background={"bg-[#d9d9d9]"} value="View Profile" />
							<MenuButton background={"bg-[#BBBBBB]"} value="Settings" />
							<MenuButton background={"bg-[#EA7F87]"} value="Logout" />
						</div>
					</div>

end
				</div>

				<div className="w-full h-[92%] mt-8 flex justify-between">

					<div className="w-[80%] h-full flex flex-col items-center justify-evenly flex-wrap">
						<div className="flex items-center gap-72">
							<PlayerCard img="/assets/hamza.png" name="Hamza BouQssim" username="@hbouqssi" />
							<PlayerCard img="/assets/unknown.png" name="" username="" />
						</div>

						<div className="border-t-2 border-solid border-white w-[360px] h-[250px] flex flex-col items-center gap-12 justify-end">
							<h2 className="text-[20px] w-[400px] font-['Whitney_SemiBold'] text-center">Select Bot Opponent or Await Player Joining</h2>
							<button className="w-[248px] h-[59px] bg-white rounded-[40px] text-black text-[20px] font-['Whitney_SemiBold'] ease-in-out duration-[30ms] hover:bg-[--pink-color]">
								<FontAwesomeIcon icon={faRobot} />
								<span className="ml-2">Play With Bot</span>
							</button>
						</div>
					</div>

					<div className="w-[435px] h-full bg-white rounded-[40px] py-12 px-4 flex flex-col items-center gap-10">
						<div className="w-[80%] h-[54px] bg-[#5B8CD4] rounded-[40px] text-[25px] font-['Whitney_BlackSC'] text-center pt-1">invite a friend</div>

						<div className="w-full h-full flex flex-col gap-4 overflow-y-auto">
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
			</div> */}
		</section>
	);
};

export default DashBoard;
