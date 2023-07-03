import "./Header.css";
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowDown } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
	return (
		<header className='py-[59px] h-[1080px] relative'>
			<section className="flex items-center justify-between absolute w-[100%] px-[300px]">
				<div>
					<Image className='mix-blend-lighten max-w-full'
						src="/assets/42.svg"
						width={100}
						height={100}
						alt="ping-pong"
					/>
				</div>
				<nav className='flex flex-row items-center justify-between gap-[15px] cursor-pointer'>
					<a href="#about" className="link-style">About</a>
					<a href="#team" className="link-style">Team</a>
					<a href="#" className="link-style">Features</a>
					<a href="#authenticate" className="btn-style inline-block">Sign In</a>
				</nav>
			</section>

			<section className="flex justify-between items-center top-[33%] absolute w-[100%] px-[300px]">
				<div className='flex flex-col items-center justify-between mt-[40px] text-[25px] font-bold'>
					<h1 className='text-[60px] text-center font-bold uppercase w-[740px]' >Brace yourself for the epic battle ahead</h1>
					<a href="#" className='inline-block btn-style w-[240px] text-center mt-[50px]'>Play</a>
					<FontAwesomeIcon icon={faCircleArrowDown} className='text-white w-[45px] mt-[70px] hover:cursor-pointer animate-bounce hover:text-[var(--pink-color)] transition ease-in-out duration-300'/>
				</div>
				<div>
					<Image className='mix-blend-lighten border-solid border-white border-2 rounded-[30px] rotate-[-18deg] shadow-[0_0_50px_2px_var(--blue-color)]'
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
