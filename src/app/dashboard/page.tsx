"use client";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faComment, faGamepad, faGear, faRightFromBracket, faChevronDown, faBell, faRobot, faBars, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from "react";
import { MenuButton } from "../components/Buttons";
import InviteField from "../components/InviteField";
import PlayerCard from "../components/PlayerCard";

const DashBoard = () => {

	const [change, setChange] = useState<boolean>(true),
		[hidden, setHidden] = useState<boolean>(true);
	// let [lastTarget, setLastTarget] = useState<HTMLDivElement | null>(null);
	const parentRef = useRef<HTMLUListElement>(null),
		sideBarRef = useRef<HTMLDivElement>(null),
		asideRef = useRef<HTMLElement>(null);
	
	let getLastTarget : HTMLLIElement | null;

	// useEffect(() => {
	// 	lastTarget = sideBarRef.current!.parentNode as HTMLDivElement;
	// }, [sideBarRef.current]);
	useEffect(() => {
		getLastTarget = sideBarRef.current!.parentNode as HTMLLIElement;
	}, [sideBarRef.current]);

	const handleClick = (e : React.MouseEvent<HTMLLIElement, MouseEvent>) : void => {

		const firstLiTopValue = 187;

		// sideBarRef.current!.style.top = `${(e.currentTarget.getBoundingClientRect().top + (lastTarget!.getBoundingClientRect().height / 2)) - firstLiTopValue}px`;
		// console.log(lastTarget!.getBoundingClientRect().height);
		sideBarRef.current!.style.top = `${(e.currentTarget.getBoundingClientRect().top + 49) - firstLiTopValue}px`;
		if (getLastTarget)
			getLastTarget.style.color = "rgba(255,255,255,0.5)";
		e.currentTarget.style.color = "white";
		getLastTarget = e.currentTarget;
		// setLastTarget(e.currentTarget);
	};

	return (
		// <section className={`bg-[url('/assets/dashboard.svg')] ${ window.innerHeight < 830 ? 'h-[830px]' : 'h-[100vh]' } bg-cover bg-[#1E1B36] flex items-center text-white`}>
		// <aside className="py-10 w-[123px] h-[100vh] bg-gradient-to-b from-[#5b8cd454] via-[#5b8bd454] to-[#35375f] rounded-r-[40px] flex flex-col items-center gap-24 shadow-[1px_1px_6px_1px_rgba(0,0,0,0.40)]"> */}
		<section className="fixed bg-[url('/assets/dashboard.svg')] bg-cover bg-fixed h-[100vh] w-full bg-[#1E1B36] text-white overflow-y-auto">
			<div className="relative min-h-[830px] h-full py-8">
				<aside ref={asideRef} className="absolute z-10 mt-[-32px] py-10 h-full w-[123px] ml-[-115px] bg-gradient-to-b from-[#5b8cd454] via-[#5b8bd454] to-[#35375f] rounded-r-[40px] flex flex-col items-center gap-24 shadow-[1px_1px_6px_1px_rgba(0,0,0,0.40)] ease-in-out duration-300 pointer-events-none">
					<FontAwesomeIcon icon={faChevronDown} className="absolute w-[25px] h-[25px] p-2 transform rotate-[-90deg] top-9 right-[-22px] bg-[--pink-color] rounded-[50%] ease-in-out duration-300 cursor-pointer xl:hidden pointer-events-auto" onClick={(e) => {
						if (hidden)
						{
							asideRef.current!.style.cssText = "margin-left: 0; pointer-events: auto";
							e.currentTarget.style.cssText = "transform: rotate(90deg); right: -15px; background: #32416A";
						}
						else
						{
							asideRef.current!.style.pointerEvents = "none";
							asideRef.current!.style.marginLeft = "-115px";
							e.currentTarget.style.transform = "rotate(-90deg)";
							e.currentTarget.style.right = "-22px";
							e.currentTarget.style.backgroundColor = "var(--pink-color)";
						}
						setHidden(!hidden);
					}} />
					{/* <div>
						<Image className="mix-blend-lighten"
							key={0}
							src={'/assets/42-dash.svg'}
							width={72}
							height={51}
							alt="42logo"
						/>
					</div> */}
					<div className="w-[50px] h-[50px]">
						<Image className="mix-blend-lighten"
							key={0}
							src={'/assets/42-dash.svg'}
							width={50}
							height={50}
							alt="42logo"
						/>
					</div>
					<ul className="relative w-full h-full" ref={parentRef}>
						<li className="relative group li-style text-white" onClick={(e) => handleClick(e)} >
							<div ref={sideBarRef} className="absolute top-[50%] translate-y-[-50%] right-0 h-[50px] border-[3px] border-solid border-white rounded-xl ease-linear duration-150"></div>
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
						<li className="group li-style absolute w-full bottom-0 transform rotate-[-180deg] ">
							<FontAwesomeIcon icon={faRightFromBracket} className="icon-aside-bar" />
						</li>
					</ul>
				</aside>

				<div className="fixed flex items-center flex-wrap w-full justify-end gap-4">
					<div className="relative w-[45px] h-[45px] bg-[rgba(255,255,255,0.22)] rounded-[50%] cursor-pointer shrink-0 hover:bg-[--pink-color]">
						<FontAwesomeIcon icon={faBell} className="w-[20px] h-[20px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
					</div>

					<div className="bg-[#ffffff38] flex items-center w-[180px] h-[50px] rounded-l-[93px] right-0">
						<div className="bg-black rounded-[50%] h-[90%] ml-[.2rem] mr-3 overflow-hidden shrink-0">
							<Image className="mix-blend-lighten h-full w-full"
								key={0}
								src={'/assets/hamza.png'}
								width={72}
								height={51}
								alt="user"
							/>
						</div>
						<div className="font-['Whitney_Bold']"> 
							<h3 className="text-sm">Hamza BouQssim</h3>
							<span className="text-xs">@hbouqssi</span>
						</div>
					</div>
					{/* <FontAwesomeIcon icon={faBars} className="fixed right-4 bottom-4 text-lg" onClick={() => setChange(!change)} />
						<div className={`fixed ${!change ? 'flex' : 'hidden'} w-[247px] h-[134px] bg-white bottom-12 right-4 rounded-[15px] items-center justify-center flex-col gap-1 font-['Whitney_Semibold'] border-2 border-solid border-[#8E8E8E]`}>
						<MenuButton background={"bg-[#d9d9d9]"} value="View Profile" />
						<MenuButton background={"bg-[#BBBBBB]"} value="Settings" />
						<MenuButton background={"bg-[#EA7F87]"} value="Logout" />
					</div> */}
				</div>

				<FontAwesomeIcon icon={faUserGroup} className="fixed bottom-4 right-4 w-[20px] h-[20px] bg-[#ffffff38] p-3 rounded-[50%] cursor-pointer hover:bg-[--pink-color]" />
			</div>



			{/* <div className="w-full h-[100vh] p-10">
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
			</div> */}
		</section>
	);
}

export default DashBoard;