"use client";
import "./Header.css";
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowDown, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useRef } from "react";

const Header = () => {

	const navRef = useRef<HTMLDivElement | null>(null),
		barsIconRef = useRef<HTMLDivElement | null>(null),
		xMarkIconRef = useRef<HTMLDivElement | null>(null);

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

		if (navRef.current && barsIconRef.current && xMarkIconRef.current)
		{
			if (e.currentTarget === barsIconRef.current)
			{
				barsIconRef.current.classList.remove('block');
				barsIconRef.current.classList.add('hidden');
				xMarkIconRef.current.classList.remove('hidden');
				xMarkIconRef.current.classList.add('block');
				navRef.current.classList.remove('hidden');
				navRef.current.classList.add('block');
			}
			else
			{
				xMarkIconRef.current.classList.remove('block');
				xMarkIconRef.current.classList.add('hidden');
				barsIconRef.current.classList.remove('hidden');
				barsIconRef.current.classList.add('block');
				navRef.current.classList.remove('block');
				navRef.current.classList.add('hidden');
			}
		}
	}

	return (
		<header className="py-[59px] px-[15%]">
			<section className="flex items-center justify-between">
				<div>
					<Image className="md:w-11 xl:text-lg"
						src={"/assets/42.svg"}
						width={35}
						height={35}
						alt="ping-pong"
						/>
				</div>
				<div ref={barsIconRef} className="text-2xl cursor-pointer hover:text-red-500 sm:hidden" onClick={(e) => handleClick(e)}>
					<FontAwesomeIcon icon={faBars} />
				</div>
				<div className="absolute z-10 top-12 left-1/2 translate-x-[-50%] glassmorphism rounded-xl flex flex-col-reverse items-end default-styles">
					<div ref={navRef} className="hidden sm:block">
						<nav className="flex flex-col items-center gap-3 text-xs p-2 pb-6 sm:flex-row sm:p-0 md:text-sm">
							<a href="#about" className="link-style">About</a>
							<a href="#team" className="link-style">Team</a>
							<a href="#featues" className="link-style">Features</a>
							<a href="#authenticate" className="btn-style">Sign In</a>
						</nav>
					</div>
					<div ref={xMarkIconRef} className="hidden text-2xl cursor-pointer mr-5 mt-3 w-fit hover:text-red-500 sm:hidden" onClick={(e) => handleClick(e)}>
						<FontAwesomeIcon icon={faXmark} />
					</div>
				</div>
			</section>

			<section className="flex flex-col items-center justify-between gap-10 mt-16 md:flex-row md:mt-24 xl:mt-36">
				<div className="flex flex-col items-center gap-7 sm:px-0 xl:gap-10">
					<div className="text-center text-xl font-bold md:text-3xl md:w-80 lg:w-96 xl:text-4xl 2xl:text-5xl 2xl:w-[32rem]">
						<h1>Brace yourself for the epic battle ahead</h1>
					</div>
					<div className="flex flex-col items-center gap-7">
						<div className="md:text-xl xl:text-2xl" >
							<a href="#" className="btn-style">Play</a>
						</div>
						<div className='hover:cursor-pointer animate-bounce text-3xl hover:text-[var(--pink-color)] transition ease-in-out duration-300 2xl:text-4xl'>
							<FontAwesomeIcon icon={faCircleArrowDown} />
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<Image className="mix-blend-lighten border-solid border-white border-2 rotate-[-18deg] shadow-[0_0_50px_2px_var(--blue-color)] rounded-2xl lg:w-80 xl:w-96 2xl:w-[32rem]"
						src="/assets/ping-pong.gif"
						width={240}
						height={240}
						alt="ping-pong" />
				</div>
			</section>
		</header>
	);
};

export default Header;
