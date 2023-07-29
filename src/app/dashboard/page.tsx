"use client";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faComment, faGamepad, faGear, faRightFromBracket, faChevronDown, faBell } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from "react";
import { MenuButton } from "../components/Buttons";
import InviteField from "../components/InviteField";

const DashBoard = () => {

	const [change, setChange] = useState<boolean>(true);

	const parentRef = useRef<HTMLUListElement>(null);

	const handleClick = (e : React.MouseEvent<HTMLLIElement, MouseEvent>) : void => {

		const collection = parentRef.current!.children;

		for (let i = 0; i < 5; i++)
		{
			collection[i].classList.remove("bg-[--dark-purple-color]");
			collection[i].children[0].classList.remove("translate-x-[25px]", "scale-150", "text-[--pink-color]");
		}

		e.currentTarget.classList.add("bg-[--dark-purple-color]");
		e.currentTarget.children[0].classList.add("translate-x-[25px]", "scale-150", "text-[--pink-color]");
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
					<li className="group li-style bg-[--dark-purple-color]" onClick={(e) => handleClick(e)} >
						<FontAwesomeIcon icon={faHouse} className="icon-aside-bar translate-x-[25px] scale-150 text-[--pink-color]"/>
					</li>
					<li className="group li-style" onClick={(e) => handleClick(e)}>
						<FontAwesomeIcon icon={faComment} className="icon-aside-bar" />
					</li>
					<li className="group li-style" onClick={(e) => handleClick(e)}>
						<FontAwesomeIcon icon={faGamepad} className="icon-aside-bar" />
					</li>
					<li className="group li-style" onClick={(e) => handleClick(e)}>
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

			<section className="w-full h-[100vh] p-10">
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

					<div className="w-[80%] h-full"></div>

					<div className="w-[420px] h-full bg-white rounded-[40px] py-12 px-4 flex flex-col items-center gap-10">
						<button className="w-[80%] h-[54px] bg-[#5B8CD4] rounded-[40px] text-[25px] font-['Whitney_BlackSC']">invite a friend</button>

						<div className="w-full h-full flex flex-col gap-4 overflow-y-auto pr-3">
							<InviteField />
							<InviteField />
							<InviteField />
							<InviteField />
						</div>

					</div>
				</div>
			</section>
		</section>
	);
}

export default DashBoard;