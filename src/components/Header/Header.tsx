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
					<Image
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
						<nav className="flex flex-col items-center gap-3 text-xs p-2 pb-6 sm:flex-row sm:p-0">
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

			<section className="flex flex-col items-center justify-between gap-10 mt-16 md:flex-row md:mt-24">
				<div className="flex flex-col items-center gap-7 sm:px-0 md:just">
					<div className="text-center text-xl font-bold md:text-2xl md:w-64">
						<h1>Brace yourself for the epic battle ahead</h1>
					</div>
					<div className="flex flex-col items-center gap-7">
						<div>
							<a href="#" className="btn-style">Play</a>
						</div>
						<div className='hover:cursor-pointer animate-bounce text-2xl hover:text-[var(--pink-color)] transition ease-in-out duration-300'>
							<FontAwesomeIcon icon={faCircleArrowDown} />
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<Image className="mix-blend-lighten rotate-[-18deg] shadow-[0_0_50px_2px_var(--blue-color)] rounded-2xl"
						src="/assets/ping-pong.gif"
						width={640}
						height={640}
						alt="ping-pong" />
				</div>
			</section>
		</header>
		// <header className='relative h-[1080px] py-[59px] px-[15%]'>
		// 	<section className="absolute flex py-[2%] w-[70%] flex-col justify-between items-start sm:flex-col sm:items-center xl:flex-row">
		// 		<div>
		// 			<Image className='shrink-[1] mix-blend-lighten max-w-ful w-[55px] sm:w-[70px]'
		// 				src="/assets/42.svg"
		// 				width={100}
		// 				height={100}
		// 				alt="ping-pong" />
		// 		</div>
		// 		<nav ref={navRef} className='rounded-3xl hidden text-center glassmorphism shrink-[1] sm:flex flex-col items-center cursor-pointer mt-[20px] w-[100%] p-[20px] z-10 sm:bg-transparent sm:shadow-none sm:justify-between sm:w-fit sm:flex-row sm:gap-[15px] sm:mt-[30px] xl:justify-between xl:mt-0 xl:gap-[15px]'>
		// 			<a onClick={()=> {
		// 				document.getElementById('about')?.scrollIntoView({block: "center"});
		// 			}} className="link-style my-[8px] sm:m-0"
		// 				>About</a>
		// 			<a onClick={() => {
		// 				document.getElementById('team')?.scrollIntoView({block: "center"})
		// 			}}	className="link-style my-[8px] sm:m-0">Team</a>
		// 			<a href="#" className="link-style my-[8px] sm:m-0">Features</a>
		// 			<a href="#authenticate" className="btn-style inline-block my-[20px] sm:m-0">Sign In</a>
		// 		</nav>
		// 		<div className="absolute right-0 top-[68px] cursor-pointer w-fit sm:hidden" >
		// 			<FontAwesomeIcon icon={faXmark} className='text-[35px] absolute right-0 top-[-58px] hidden sm:hidden' ref={closeRef}  name="close"  onClick={ (e) => handleClick(e)} />
		// 			<FontAwesomeIcon icon={faBars} className='text-[30px] absolute right-0 top-[-55px] sm:hidden block' ref={menuRef} name="menu" onClick={ (e) => handleClick(e) } />
		// 		</div>
		// 	</section>

		// 	<section className="absolute w-[70%] py-[100px] flex justify-between items-center gap-[100px] flex-col-reverse top-[25%] sm:top-[25%] xl:flex-row xl:top-[90px]">
		// 		<div className='flex flex-col items-center text-[25px] font-bold'>
		// 			<h1 className='text-[25px] text-center font-bold uppercase sm:text-[45px] sm:mt-[100px] xl:text-[35px] xl:w-[450px]'>Brace yourself for the epic battle ahead</h1>
		// 			<div className="w-[250px] h-[200px] flex flex-col items-center justify-around">
		// 				<a href="#" className='inline-block btn-style w-[200px] text-center'>Play</a>
		// 				<FontAwesomeIcon icon={faCircleArrowDown} className='text-white text-[45px] hover:cursor-pointer animate-bounce hover:text-[var(--pink-color)] transition ease-in-out duration-300'/>
		// 			</div>
		// 		</div>
		// 		<div>
		// 			<Image className='mix-blend-lighten border-solid border-white border-2 rounded-[30px] rotate-[-18deg] shadow-[0_0_50px_2px_var(--blue-color)] sm:w-[400px] sm:mt-[-50px] xl:w-[650px]'
		// 				src="/assets/ping-pong.gif"
		// 				width={650}
		// 				height={650}
		// 				alt="ping-pong" />
		// 		</div>
		// 	</section>
		// 	{/* <hr className='w-[20%] border-[2px] absolute bottom-0 left-[40%]' /> */}
		// </header>
	);
};

export default Header;
