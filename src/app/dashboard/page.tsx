"use client";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faComment, faGamepad, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useRef } from "react";

const DashBoard = () => {

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
			<aside className="py-14 w-[123px] h-[100vh] bg-gradient-to-b from-[#5b8cd454] via-[#5b8bd454] to-[#35375f] rounded-r-[40px] flex flex-col items-center gap-24 shadow-[1px_1px_6px_1px_rgba(0,0,0,0.40)]">
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

			{/* <div className="w-full h-[100vh]">
			</div> */}
		</section>
	);
}

export default DashBoard;