"use client";
import React, { forwardRef, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import "./Authenticate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Authenticate = () => {

	const containerRef  = useRef<HTMLDivElement>(null),
		subContainerRef = useRef<HTMLDivElement>(null),
		btnSignInRef = useRef<HTMLButtonElement>(null),
		btnSignUpRef = useRef<HTMLButtonElement>(null),
		signInRef = useRef<HTMLFormElement>(null),
		// inpEmailRef = useRef<SVGSVGElement>(null),
		signUpRef = useRef<HTMLFormElement>(null);

	const imgArr = [
		"/assets/google.svg",
		"/assets/42-auth.svg",
		"/assets/github.svg",
	];

	const icons: JSX.Element[] = imgArr.map((el, i): JSX.Element => (
		<Image
			className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300 w-5 sm:w-6 md:w-7"
			key={i}
			src={el}
			width={40}
			height={40}
			alt={el.substring(8)} />
	));

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {

	if (getComputedStyle(e.currentTarget).backgroundColor == "rgb(224, 224, 224)")
		{
			if (e.currentTarget.textContent === "Sign Up")
			{
				if (window.innerWidth >= 768)
				{
					containerRef.current!.style.transform = "rotate(-90deg)";
					subContainerRef.current!.style.transform = "rotate(90deg)";
				}
				btnSignInRef.current?.classList.remove("active-btn-style");
				btnSignInRef.current?.classList.add("disabled-btn-style");
				btnSignUpRef.current?.classList.remove("disabled-btn-style");
				btnSignUpRef.current?.classList.add("active-btn-style");
				signInRef.current!.style.display = "none";
				signUpRef.current!.style.display = "block";
			}
			else if (e.currentTarget.textContent === "Sign In")
			{
				if (window.innerWidth >= 768)
				{
					containerRef.current!.style.transform = "rotate(0deg)";
					subContainerRef.current!.style.transform = "rotate(0deg)";
				}
				btnSignInRef.current?.classList.remove("disabled-btn-style");
				btnSignInRef.current?.classList.add("active-btn-style");
				btnSignUpRef.current?.classList.remove("active-btn-style");
				btnSignUpRef.current?.classList.add("disabled-btn-style");
				signInRef.current!.style.display = "block";
				signUpRef.current!.style.display = "none";
			}
		}
	};

	return (
			<div id="authenticate" className="absolute h-full w-full glassmorphism backdrop-blur-[5px] flex flex-col items-center justify-center">
				<div ref={containerRef} className="absolute bg-transparent custom-shape sm:left-[15%] md:bg-white md:py-8 md:px-8 transition-all ease-in-out duration-700">
					<div ref={subContainerRef} className="bg-white custom-shape py-7 px-4 transition-all ease-in-out duration-700 flex flex-col items-center gap-4 sm:py-10 sm:px-9 sm:gap-5 md:bg-transparent md:py-4 md:px-6">
							<div className="transition-all duration-300 w-44 h-8 bg-[var(--gray-color)] rounded-tr-[37px] rounded-br-[268px] rounded-bl-[37px] rounded-tl-[268px] flex items-center justify-center sm:w-64 sm:h-11 md:w-72 md:h-12">
								<button ref={btnSignInRef} className="h-[80%] w-[48%] bg-white text-black rounded-r-[120px] rounded-bl-[37px] rounded-tl-[268px] text-[.7rem] transition ease-in-out duration-500 sm:text-sm" onClick={(e) => handleClick(e)} >
									Sign In
								</button>
								<button ref={btnSignUpRef} className="h-[80%] w-[48%] bg-[#E0E0E0] text-[#949494] rounded-l-[120px] rounded-br-[268px] rounded-tr-[37px] text-[.7rem] transition ease-in-out duration-500 sm:text-sm" onClick={(e) => handleClick(e)} >
									Sign Up
								</button>
							</div>
							<div className="flex justify-center items-center gap-4 cursor-pointer">
								{icons}
							</div>
							<div className="h-[2px] bg-[#8E8E8E] relative w-56 md:w-[17rem]">
								<span className="absolute bg-white text-[#8E8E8E] text-[.7rem] px-2 top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] sm:text-sm md:text-[.9rem]">OR</span>
							</div>
						{/* <div className="h-[280px] w-[403px]"> */}
						<div>
							<SignIn ref={signInRef} />
							<SignUp ref={signUpRef} />
						</div>
					</div>
				</div>
			</div>
	);
};

// Sign In Component :)
const SignIn = forwardRef( (props: any, ref: any) => {

	type FormData = {
		email: string;
		password: string;
	};

	const { register, handleSubmit, formState: {errors} } = useForm<FormData>();

	// const onSubmit = () => {
	// 	if (errors.email?)
	// };
// console.log(errors);
	return (
		<div ref={ref}>
			<form
				action=""
				className="relative h-full w-full flex items-center justify-center flex-col gap-3 sm:gap-4"
				onSubmit={handleSubmit( (data) => {
					console.log(data); } )}
				// onSubmit={onSubmit}
					>
				<div className="relative">
					<FontAwesomeIcon icon={faEnvelope} className="absolute top-[50%] left-[10%] transform translate-y-[-50%] text-black text-[.7rem] md:text-sm" />
					<input
						type="email"
						className="custom-shape input-style" placeholder="email"
						{...register("email", {required: "true"}) } />
				</div>
				<div className="relative">
					<FontAwesomeIcon icon={faKey} className="absolute top-[50%] left-[10%] transform translate-y-[-50%] text-black text-[.7rem] md:text-sm" />
					<input type="password"
						className="custom-shape input-style" placeholder="password"
						{...register("password", {required: true, minLength: 8})}  />
				</div>
				<button type="submit" className="custom-shape btn-style text-[.7rem] bg-[var(--purple-color)] transition ease-in-out duration-700 sm:text-sm md:text-[1rem] md:py-4 md:w-[166px]" >
					Sign In
				</button>
			</form>
		</div>
	);
});

// Sign Up Component :)
const SignUp = forwardRef((props: any, ref: any) => {

	type FormData = {
		email: string;
		password: string;
		repassword: string;
	};

	const { register, handleSubmit } = useForm<FormData>();

	return (
		<div ref={ref} className="hidden">
			<form
				action=""
				className="relative h-full w-full flex items-center justify-center flex-col gap-3 sm:gap-4"
				onSubmit={handleSubmit((data) => {
					console.log(data); })}
				>
				<div className="relative">
				<FontAwesomeIcon icon={faEnvelope} className="absolute top-[50%] left-[10%] transform translate-y-[-50%] text-black text-[.7rem] md:text-sm" />
					<input
						type="email"
						className="custom-shape input-style" placeholder="email"
						{...register("email", {required: "true"}) } />
				</div>
				<div className="relative w-56 flex justify-between sm:w-60 md:w-[17rem]" >
					<div className="relative">
						<FontAwesomeIcon
							icon={faKey}
							className="absolute top-[50%] left-[10%] transform translate-y-[-50%] text-black text-[.7rem] md:text-sm" />
						<input
							type="password"
							{...register("password", {required: true, minLength: 8})}
							className="input-password-style rounded-bl-[37px] rounded-tl-[268px] rounded-r-[40px]"
							placeholder="password" />
					</div>
					<div className="relative">
						<FontAwesomeIcon
							icon={faKey}
							className="absolute top-[50%] left-[10%] transform translate-y-[-50%] text-black text-[.7rem] md:text-sm" />
						<input
							type="password"
							{...register("repassword", {required: true, minLength: 8})}
							className="input-password-style rounded-br-[268px] rounded-tr-[37px] rounded-l-[40px]"
							placeholder="confirm" />
					</div>
				</div>
				<button
					type="submit"
					className="custom-shape btn-style text-[.7rem] bg-[var(--purple-color)] transition ease-in-out duration-700 sm:text-sm md:text-[1rem] md:py-4 md:w-[166px]" >
					Sign Up
				</button>
			</form>
		</div>
	);
});

export default Authenticate;