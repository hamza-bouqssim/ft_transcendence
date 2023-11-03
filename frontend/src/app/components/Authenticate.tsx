"use client";
import React, { useRef } from "react";
import Image from "next/image";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import {
	GoogleSignInButton,
	IntraSignInButton,
	GithubSignInButton,
} from "./Buttons";

const Authenticate = () => {

	const containerRef = useRef<HTMLDivElement>(null),
		subContainerRef = useRef<HTMLDivElement>(null),
		btnSignInRef = useRef<HTMLButtonElement>(null),
		btnSignUpRef = useRef<HTMLButtonElement>(null),
		signInRef = useRef<HTMLFormElement>(null),
		signUpRef = useRef<HTMLFormElement>(null);

	const imgArr = [
		"/assets/google.svg",
		"/assets/42-auth.svg",
		"/assets/github.svg",
	];

	const icons: JSX.Element[] = imgArr.map(
		(el, i): JSX.Element => (
			<button key={i}>
				<Image
					className="w-5 hover:scale-150 hover:transform hover:transition hover:duration-300 hover:ease-in-out sm:w-6 md:w-7"
					src={el}
					width={40}
					height={40}
					alt={el.substring(8)}
				/>
			</button>
		),
	);

	const handleClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		if (
			getComputedStyle(e.currentTarget).backgroundColor == "rgb(224, 224, 224)"
		) {
			if (e.currentTarget.textContent === "Sign Up") {
				if (window.innerWidth >= 768) {
					containerRef.current!.style.transform = "rotate(-90deg)";
					subContainerRef.current!.style.transform = "rotate(90deg)";
				}
				btnSignInRef.current?.classList.remove("active-btn-style");
				btnSignInRef.current?.classList.add("disabled-btn-style");
				btnSignUpRef.current?.classList.remove("disabled-btn-style");
				btnSignUpRef.current?.classList.add("active-btn-style");
				signInRef.current!.style.display = "none";
				signUpRef.current!.style.display = "block";
				// avatarRef.current!.style.display = "block";
			} else if (e.currentTarget.textContent === "Sign In") {
				if (window.innerWidth >= 768) {
					containerRef.current!.style.transform = "rotate(0deg)";
					subContainerRef.current!.style.transform = "rotate(0deg)";
				}
				btnSignInRef.current?.classList.remove("disabled-btn-style");
				btnSignInRef.current?.classList.add("active-btn-style");
				btnSignUpRef.current?.classList.remove("active-btn-style");
				btnSignUpRef.current?.classList.add("disabled-btn-style");
				signInRef.current!.style.display = "block";
				signUpRef.current!.style.display = "none";
				// avatarRef.current!.style.display = "none";
			}
		}
	};

	return (
		<div
			ref={containerRef}
			className="custom-shape absolute transition-all duration-700 ease-in-out sm:left-[15%] md:bg-white md:px-8 md:py-8"
		>
			<div
				ref={subContainerRef}
				className="custom-shape flex flex-col items-center gap-4 bg-white px-4 py-7 transition-all duration-700 ease-in-out sm:gap-5 sm:px-9 sm:py-10 md:bg-transparent md:px-6 md:py-4 2xl:py-36"
			>
				<div className="flex h-8 w-44 items-center justify-center rounded-bl-[37px] rounded-br-[268px] rounded-tl-[268px] rounded-tr-[37px] bg-[var(--gray-color)] transition-all duration-300 sm:h-11 sm:w-64 md:h-12 md:w-72 2xl:h-[70px] 2xl:w-[554px]">
					<button
						ref={btnSignInRef}
						className="h-[80%] w-[48%] rounded-r-[120px] rounded-bl-[37px] rounded-tl-[268px] bg-white text-[.7rem] text-black transition duration-500 ease-in-out sm:text-sm 2xl:text-lg"
						onClick={(e) => handleClick(e)}
					>
						Sign In
					</button>
					<button
						ref={btnSignUpRef}
						className="h-[80%] w-[48%] rounded-l-[120px] rounded-br-[268px] rounded-tr-[37px] bg-[#E0E0E0] text-[.7rem] text-[#949494] transition duration-500 ease-in-out sm:text-sm 2xl:text-lg"
						onClick={(e) => handleClick(e)}
					>
						Sign Up
					</button>
				</div>
				<div className="flex cursor-pointer items-center justify-center gap-4">
					<GoogleSignInButton />
					<IntraSignInButton />
					<GithubSignInButton />
				</div>
				<div className="relative h-[2px] w-56 bg-[#8E8E8E] md:w-[17rem]">
					<span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] transform bg-white px-2 text-[.7rem] text-[#8E8E8E] sm:text-sm md:text-[.9rem]">
						OR
					</span>
				</div>
				<div>
					<SignInForm ref={signInRef} />
					<SignUpForm ref={signUpRef} />
				</div>
			</div>
		</div>
	);
};

export default Authenticate;