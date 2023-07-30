"use client";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faComment, faGamepad, faGear, faRightFromBracket, faChevronDown, faBell, faRobot } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from "react";
import { MenuButton } from "../components/Buttons";
import InviteField from "../components/InviteField";
import PlayerCard from "../components/PlayerCard";

const DashBoard = () => {

	const [change, setChange] = useState<boolean>(true);
	const parentRef = useRef<HTMLUListElement>(null),
	sideBarRef = useRef<HTMLDivElement>(null);
	let getLastTarget : HTMLLIElement | null;

	useEffect(() => {
		getLastTarget = sideBarRef.current!.parentNode as HTMLLIElement;
	}, []);

	const handleClick = (e : React.MouseEvent<HTMLLIElement, MouseEvent>) : void => {

		const firstLiTopValue = 187;

		sideBarRef.current!.style.top = `${e.currentTarget.getBoundingClientRect().top - firstLiTopValue}px`;
		
		if (getLastTarget)
			getLastTarget.style.color = "rgba(255,255,255,0.5)";
		e.currentTarget.style.color = "";
		getLastTarget = e.currentTarget;
	};

	return (
		<section className="bg-[url('/assets/dashboard.svg')] bg-cover bg-[#1E1B36] flex items-center text-white">
			<aside className="py-10 w-[123px] h-[100vh] bg-gradient-to-b from-[#5b8cd454] via-[#5b8bd454] to-[#35375f] rounded-r-[40px] flex flex-col items-center gap-24 shadow-[1px_1px_6px_1px_rgba(0,0,0,0.40)]">
				<div>
					<Image className="mix-blend-lighten"
						key={0}
						src={'/assets/42-dash.svg'}
						width={72}
						height={51}
						alt="42logo"
					/>
				</div>
				<ul className="relative w-full h-full" ref={parentRef}>
					<li className="relative group li-style text-white" onClick={(e) => handleClick(e)} >
						<div ref={sideBarRef} className="absolute top-0 right-0 h-full border-[3px] border-solid border-white rounded-xl ease-linear duration-150"></div>
						<FontAwesomeIcon icon={faHouse} className="icon-aside-bar"/>
					</li>
					<li className="group li-style text-[rgba(255,255,255,.5)]" onClick={(e) => handleClick(e)}>
						<FontAwesomeIcon icon={faComment} className="icon-aside-bar" />
					</li>
					<li className="group li-style text-[rgba(255,255,255,.5)]" onClick={(e) => handleClick(e)}>
						<FontAwesomeIcon icon={faGamepad} className="icon-aside-bar" />
					</li>
					<li className="group li-style text-[rgba(255,255,255,.5)]" onClick={(e) => handleClick(e)}>
						<FontAwesomeIcon icon={faGear} className="icon-aside-bar" />
					</li>
					{/* <li className="py-8 bg-green-400">
						<div className="w-[57px] h-1 bg-white rounded-2xl m-auto mt-40"></div>
					</li> */}
					<li className="group li-style absolute w-full bottom-0 transform rotate-[-180deg] ">
						<FontAwesomeIcon icon={faRightFromBracket} className="icon-aside-bar" />
					</li>
				</ul>
			</aside>

			<div className="w-full h-[100vh] p-10">
				<div className="flex items-center justify-end gap-10">
					<div className="relative group w-[64px] h-[64px] bg-[rgba(255,255,255,0.22)] rounded-[50%] cursor-pointer">
						<FontAwesomeIcon icon={faBell} className="text-3xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] group-hover:text-[--pink-color]" />
					</div>
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
			</div>
		</section>
	);
}

export default DashBoard;