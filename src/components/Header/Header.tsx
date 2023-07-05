"use client";
import "./Header.css";
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowDown, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

const Header = () => {

	const handleClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {

		const nav = document.querySelector('nav');
		const menu = document.getElementById('menu');
		const close = document.getElementById('close');
		if (nav && close && menu)
		{
			if (e.currentTarget.getAttribute('name') == 'menu')
			{
				menu.classList.remove('block');
				menu.classList.add('hidden');
				close.classList.remove('hidden');
				close.classList.add('block');
				nav.classList.remove('hidden');
				nav.classList.add('block');
			}
			else
			{
				close.classList.remove('block');
				close.classList.add('hidden');
				menu.classList.remove('hidden');
				menu.classList.add('block');
				nav.classList.remove('block');
				nav.classList.add('hidden');
			}
		}
	}

	return (
		<header className='relative h-[100vh] py-[59px] px-[15%]'>
			<section className="flex absolute py-[2%] w-[70%] justify-between flex-col items-start sm:flex-col sm:items-center xl:flex-row">
				<div>
					<Image className='shrink-[1] mix-blend-lighten max-w-ful w-[55px] sm:w-[100px]'
						src="/assets/42.svg"
						width={100}
						height={100}
						alt="ping-pong"
					/>
				</div>
				<nav className='rounded-3xl hidden text-center glassmorphism shrink-[1] sm:flex flex-col items-center cursor-pointer mt-[20px] w-[100%] p-[20px] z-10 sm:bg-transparent sm:shadow-none sm:justify-between sm:w-fit sm:flex-row sm:gap-[15px] sm:mt-[30px] xl:justify-between xl:mt-0 xl:gap-[15px]'>
					<a href="#about" className="link-style my-[8px] sm:m-0">About</a>
					<a href="#team" className="link-style my-[8px] sm:m-0">Team</a>
					<a href="#" className="link-style my-[8px] sm:m-0">Features</a>
					<a href="#authenticate" className="btn-style inline-block my-[20px] sm:m-0">Sign In</a>
				</nav>
				<div className="absolute right-0 top-[68px] cursor-pointer w-fit sm:hidden" >
					<FontAwesomeIcon icon={faXmark} className='text-[35px] absolute right-0 top-[-58px] hidden sm:hidden' name="close" id='close' onClick={ (e) => handleClick(e)} />
					<FontAwesomeIcon icon={faBars} className='text-[30px] absolute right-0 top-[-55px] sm:hidden block' name="menu" id='menu' onClick={ (e) => handleClick(e) } />
				</div>
			</section>

			<section className="absolute w-[70%] py-[100px] flex justify-between items-center gap-[100px] flex-col-reverse top-[25%] sm:top-[25%] xl:flex-row">
				<div className='flex flex-col items-center text-[25px] font-bold'>
					<h1 className='text-[25px] text-center font-bold uppercase sm:text-[45px] sm:mt-[100px] xl:text-[60px] xl:w-[740px]'>Brace yourself for the epic battle ahead</h1>
					<div className="w-[250px] h-[200px] flex flex-col items-center justify-around">
						<a href="#" className='inline-block btn-style w-[240px] text-center'>Play</a>
						<FontAwesomeIcon icon={faCircleArrowDown} className='text-white text-[45px] hover:cursor-pointer animate-bounce hover:text-[var(--pink-color)] transition ease-in-out duration-300'/>
					</div>
				</div>
				<div>
					<Image className='mix-blend-lighten border-solid border-white border-2 rounded-[30px] rotate-[-18deg] shadow-[0_0_50px_2px_var(--blue-color)] sm:w-[400px] sm:mt-[-50px] xl:w-[650px]'
						src="/assets/ping-pong.gif"
						width={650}
						height={650}
						alt="ping-pong"
					/>
				</div>
			</section>
			<hr className='w-[20%] border-[2px] absolute bottom-0 left-[40%]' />
		</header>
	);
};

export default Header;
