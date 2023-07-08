"use client";
import { forwardRef, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import "./Authenticate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Authenticate = () => {

	// This Is For Form Validation :)
	type Inputs = {
		email: string;
		password: string;
		repassword: string;
	};

	// ###################################################################### //

	const containerRef = useRef<HTMLDivElement | null>(null),
		subContainerRef = useRef<HTMLDivElement | null>(null),
		btnSignInRef = useRef<HTMLButtonElement | null>(null),
		btnSignUpRef = useRef<HTMLButtonElement | null>(null),
		signInRef = useRef<HTMLFormElement | null>(null),
		signUpRef = useRef<HTMLFormElement | null>(null);

	const imgArr = [
		"/assets/google.svg",
		"/assets/42-auth.svg",
		"/assets/github.svg",
	];

	const icons = imgArr.map((el, i) => (
		<Image
		className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300"
		key={i}
		src={el}
		width={40}
		height={40}
		alt={el.substring(8)}
		/>
	));

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		// console.log(containerRef.current);
		// console.log(subContainerRef.current);
		// console.log(btnSignInRef.current);
		// console.log(btnSignUpRef.current);
		// console.log(signInRef.current);
		// console.log(signUpRef.current);
		if (
			containerRef.current &&
			subContainerRef.current &&
			btnSignInRef.current &&
			btnSignUpRef.current &&
			signInRef.current &&
			getComputedStyle(e.currentTarget).backgroundColor == "rgb(224, 224, 224)"
			)
		{
		if (e.currentTarget.textContent === "Sign Up")
		{
			containerRef.current.style.transform = "rotate(-90deg)";
			subContainerRef.current.style.transform = "rotate(90deg)";
			btnSignInRef.current.classList.remove("active-btn-style");
			btnSignInRef.current.classList.add("disabled-btn-style");
			btnSignUpRef.current.classList.remove("disabled-btn-style");
			btnSignUpRef.current.classList.add("active-btn-style");
			signInRef.current.style.display = "none";
			// signUpRef.current.style.display = "block";
		}
		else if (e.currentTarget.textContent === "Sign In") {
			containerRef.current.style.transform = "rotate(0deg)";
			subContainerRef.current.style.transform = "rotate(0deg)";

			btnSignInRef.current.classList.remove("disabled-btn-style");
			btnSignInRef.current.classList.add("active-btn-style");
			btnSignUpRef.current.classList.remove("active-btn-style");
			btnSignUpRef.current.classList.add("disabled-btn-style");

			signInRef.current.style.display = "block";
			// signUpRef.current.style.display = "none";
		}
		}
	};

	return (
		<div id='authenticate' className="relative px-[15%]">
			<div ref={containerRef} className="absolute mt-[160px] custom-shape bg-white h-[777px] w-[683px] flex flex-col items-center justify-center transition ease-in-out duration-300 shadow-[0_0_20px_2px_black]">
				<div ref={subContainerRef} className="relative transition ease-in-out duration-700 flex flex-col items-center justify-center w-[100%] h-[100%]">
					<div className="relative h-[180px] flex flex-col items-center justify-center border-b-[1px] gap-[20px] border-solid border-[#8E8E8E]">
						<div className="transition-all duration-300 w-[554px] h-[70px] bg-[var(--gray-color)] rounded-tr-[37px] rounded-br-[268px] rounded-bl-[37px] rounded-tl-[268px] flex items-center justify-evenly">
							<button ref={btnSignInRef} className="transition ease-in-out duration-500 bg-white text-black w-[264px] rounded-r-[120px] rounded-bl-[37px] rounded-tl-[268px] h-[57px] flex items-center justify-center" onClick={(e) => handleClick(e)} >
								Sign In
							</button>
							<button ref={btnSignUpRef} className="transition ease-in-out duration-500 bg-[#E0E0E0] text-[#949494] w-[264px] rounded-l-[120px] rounded-br-[268px] rounded-tr-[37px] h-[57px] flex items-center justify-center" onClick={(e) => handleClick(e)} >
								Sign Up
							</button>
						</div>
						<div className="flex justify-center items-center cursor-pointer gap-[30px]">
							{icons}
						</div>
						<h2 className="absolute bg-white px-2 bottom-[-11px] text-[#8E8E8E]">OR</h2>
					</div>
					<div>
						{/* TODO: Function return Component signIn OR signUp */}
						{/* TODO: scrollintoview Function For Block: center */}
						{/* <SignIn ref={signInRef} />
						<SignUp ref={signUpRef} /> */}
					</div>
				</div>
			</div>
		</div>
	);
};

// Sign In Component :)
const SignIn = forwardRef( (props: any, ref : any) => {

	type Inputs = {
		email: string;
		password: string;
		repassword: string;
	};

	const { register, handleSubmit } = useForm<Inputs>();

	return (
		<form
			ref={ref}
			onSubmit={handleSubmit( (data) => {
			console.log(data);
		} )}
		action=""
		className="relative h-[280px] w-[403px] flex items-center justify-center flex-col"
		>
		<FontAwesomeIcon
			icon={faEnvelope}
			className="absolute top-[50px] left-[25px] text-black w-[16px] z-10"
		/>
		<input
			type="text"
			id="email"
			{...register("email")}
			className="absolute custom-shape input-style top-[26px]"
			placeholder="email"
		/>
		<FontAwesomeIcon
			icon={faKey}
			className="absolute top-[127px] left-[25px] text-black w-[16px] z-[1]"
		/>
		<input
			type="password"
			id="password"
			{...register("password")}
			className="absolute custom-shape input-style top-[104px]"
			placeholder="password"
		/>
		<button
			type="submit"
			className="absolute custom-shape btn-style w-[216px] h-[57px] bg-[var(--purple-color)] transition ease-in-out duration-700 bottom-[38px]"
		>
			Sign In
		</button>
		</form>
	);
});

// Sign Up Component :)
const SignUp = forwardRef((props: any, ref: any) => {

	type Inputs = {
		email: string;
		password: string;
		repassword: string;
	};

	const { register, handleSubmit } = useForm<Inputs>();

	return (
		<form
			ref={ref}
			onSubmit={handleSubmit((data) => {
			console.log(data);
			})}
			action=""
			className="relative h-[280px] w-[403px] top-[116px] flex items-center justify-center flex-col border-solid border-t-[1px] border-[#8E8E8E]"
			>
			<FontAwesomeIcon
			icon={faEnvelope}
			className="absolute top-[50px] left-[25px] text-black w-[16px] z-10"
			/>
			<input
			type="text"
			id="email"
			{...register("email")}
			className="absolute custom-shape input-style top-[26px]"
			placeholder="email"
			/>
			<div
			id="sign-up"
			className="hidden absolute w-[403px] h-[59px] top-[104px]"
			>
			<input
				type="password"
				id="password-sign-up"
				{...register("password")}
				className="input-password-style rounded-bl-[37px] rounded-tl-[268px] rounded-r-[80px]"
				placeholder="password"
			/>
			<FontAwesomeIcon
				icon={faKey}
				className="absolute top-[23px] left-[230px] text-black w-[16px] z-[1]"
			/>
			<input
				type="password"
				id="repassword"
				{...register("repassword")}
				className="input-password-style rounded-br-[268px] rounded-tr-[37px] rounded-l-[80px] right-0"
				placeholder="Confirm"
			/>
			</div>
			<button
			type="submit"
			className="absolute custom-shape btn-style w-[216px] h-[57px] bg-[var(--purple-color)] transition ease-in-out duration-700 bottom-[38px]"
			>
			Sign Up
			</button>
		</form>
	);
});

export default Authenticate;