"use client";
import Image from 'next/image'
import './Authenticate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import PingPong from "@/PingPong"

const Authenticate = () => {
	const imgArr = ['/assets/google.svg', '/assets/42.svg', '/assets/github.svg']

	const icons = imgArr.map( (el, i) => <Image
										key={i}
										src={el}
										width={40}
										height={40}
										alt={el.substring(8)} /> );

	const handleClick = (e : any) => {
		const container = document.getElementById('container');
		const subContainer = document.getElementById('sub-container');
		const btnSignUp = document.getElementById('btn-sign-up');
		const btnSignIn = document.getElementById('btn-sign-in');

		let SignUpStyle : any,
			SignInStyle : any;

		if (container && subContainer && btnSignUp && btnSignIn)
		{
			if (e.target.textContent === 'Sign Up' && e.target.style.backgroundColor != 'white')
			{
				container.style.transform = 'rotate(-90deg)';
				subContainer.style.transform = 'rotate(90deg)';

				SignUpStyle = getComputedStyle(e.target);
				SignInStyle = getComputedStyle(btnSignIn);

				btnSignIn.style.backgroundColor = SignUpStyle.backgroundColor;
				btnSignIn.style.color = SignUpStyle.color;

				btnSignUp.style.backgroundColor = SignInStyle.backgroundColor;
				btnSignUp.style.color = SignInStyle.color;
			}
			else
			{
				container.style.transform = 'rotate(0deg)';
				subContainer.style.transform = 'rotate(0deg)';
		
				SignInStyle = getComputedStyle(e.target);
				SignUpStyle = getComputedStyle(btnSignUp);

				btnSignIn.style.backgroundColor = SignUpStyle.backgroundColor;
				btnSignIn.style.color = SignUpStyle.color;

				btnSignUp.style.backgroundColor = SignInStyle.backgroundColor;
				btnSignUp.style.color = SignInStyle.color;
			}
		}
	}

	return (
			<section id="authenticate" className="custom-shape absolute top-1/2 left-[370px] transform translate-y-[-50%] w-fit">
				<PingPong/>
				<div id='container' className="custom-shape bg-white h-[777px] w-[683px] flex flex-col items-center justify-center transition ease-in-out duration-300 shadow-[0_0_20px_2px_black]">
					<div id='sub-container' className='transition ease-in-out duration-700 flex flex-col items-center justify-center w-[100%] h-[100%] relative'>
						<div className="transition-all duration-300 origin-center w-[554px] h-[70px] bg-[var(--gray-color)] absolute rounded-tr-[37px] rounded-br-[268px] rounded-bl-[37px] rounded-tl-[268px] top-[213px] left-[64px] flex items-center justify-evenly">
							<button id='btn-sign-in' className="transition ease-in-out duration-500 bg-white text-black w-[264px] rounded-r-[120px] rounded-bl-[37px] rounded-tl-[268px] h-[57px] flex items-center justify-center" onClick={handleClick}>
								Sign In
							</button>
							<button id='btn-sign-up' className="transition ease-in-out duration-500 bg-[#E0E0E0] text-[#949494] w-[264px] rounded-l-[120px] rounded-br-[268px] rounded-tr-[37px] h-[57px] flex items-center justify-center" onClick={handleClick}>
								Sign Up
							</button>
						</div>
						<div className='w-[100%] absolute gap-[30px] top-[300px] flex justify-center items-center cursor-pointer'>
							{icons}
						</div>
						<div className='absolute h-[280px] w-[403px] top-[365px] flex items-center justify-center flex-col border-solid border-t-[1px] border-[#8E8E8E]'>
							<span className='relative top-[-55px] text-[#8E8E8E] bg-white px-1' >OR</span>
							<FontAwesomeIcon icon={faEnvelope} className='relative left-[-170px] top-[-15px] text-black w-[16px]' />
							<input type="email" name="email" id="email" className='custom-shape input-style mt-[-55px]' placeholder='email' />
							<FontAwesomeIcon icon={faKey} className='relative left-[-170px] top-[40px] text-black w-[16px]'/>
							<input type="password" name="password" id="password" className='custom-shape input-style' placeholder='password' />
							<button type="submit" className='custom-shape btn-style w-[216px] h-[57px] bg-[var(--purple-color)] mt-[20px] transition ease-in-out duration-700'>Sign In</button>
						</div>
					</div>
				</div>
			</section>
		)
}

export default Authenticate