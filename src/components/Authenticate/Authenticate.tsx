"use client";
import { forwardRef, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import "./Authenticate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Authenticate = () => {

	const containerRef  = useRef<HTMLDivElement | null>(null),
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

	const icons = imgArr.map((el, i): JSX.Element => (
		<Image
			className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300"
			key={i}
			src={el}
			width={40}
			height={40}
			alt={el.substring(8)} />
	));

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {

		if (
				containerRef.current &&
				subContainerRef.current &&
				btnSignInRef.current &&
				btnSignUpRef.current &&
				signInRef.current &&
				signUpRef.current &&
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
				signUpRef.current.style.display = "block";
			}
			else if (e.currentTarget.textContent === "Sign In") {
				containerRef.current.style.transform = "rotate(0deg)";
				subContainerRef.current.style.transform = "rotate(0deg)";

				btnSignInRef.current.classList.remove("disabled-btn-style");
				btnSignInRef.current.classList.add("active-btn-style");
				btnSignUpRef.current.classList.remove("active-btn-style");
				btnSignUpRef.current.classList.add("disabled-btn-style");

				signInRef.current.style.display = "block";
				signUpRef.current.style.display = "none";
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
						{/* TODO: scrollintoview Function For Block: center */}
						<SignIn ref={signInRef} />
						<SignUp ref={signUpRef} />
					</div>
				</div>
			</div>
		</div>
	);
};

// Sign In Component :)
const SignIn = forwardRef( (props: any, ref : any) => {

	type FormData = {
		email: string;
		password: string;
	};

	const { register, handleSubmit, formState: {errors} } = useForm<FormData>();

	// const onSubmit = () => {
	// 	if (errors.email?)
	// };
console.log(errors);
	return (
		<div ref={ref} className="h-[280px] w-[403px]">
			<form
				action=""
				className="relative h-full w-full flex items-center justify-center flex-col gap-5"
				onSubmit={handleSubmit( (data) => {
					console.log(data); } )}
				// onSubmit={onSubmit}
					>
				<div className="relative">
					<FontAwesomeIcon icon={faEnvelope} className="absolute top-[40%] left-[7%] text-black w-[16px]" />
					<input
						type="email"
						className="custom-shape input-style" placeholder="email"
						{...register("email", {required: "true"}) } />
				</div>
				<div className="relative">
					<FontAwesomeIcon icon={faKey} className="absolute top-[40%] left-[7%] text-black w-[16px]" />
					<input type="password"
						className="custom-shape input-style" placeholder="password"
						{...register("password", {required: true, minLength: 8})}  />
				</div>
				<button type="submit" className="custom-shape btn-style w-[216px] h-[57px] bg-[var(--purple-color)] transition ease-in-out duration-700 bottom-[38px]" >
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
		<div ref={ref} className="h-[280px] w-[403px] hidden">
			<form
				action=""
				className="relative h-full w-full flex items-center justify-center flex-col gap-5"
				onSubmit={handleSubmit((data) => {
					console.log(data); })}
				>
				<div className="relative">
					<FontAwesomeIcon icon={faEnvelope} className="absolute top-[40%] left-[7%] text-black w-[16px]" />
					<input
						type="email"
						className="custom-shape input-style" placeholder="email"
						{...register("email", {required: "true"}) } />
				</div>
				<div className="relative flex w-[403px] justify-between" >
					<div className="relative" >
						<FontAwesomeIcon
							icon={faKey}
							className="absolute top-[40%] left-[7%] text-black w-[16px]" />
						<input
							type="password"
							{...register("password", {required: true, minLength: 8})}
							className="input-password-style rounded-bl-[37px] rounded-tl-[268px] rounded-r-[80px]"
							placeholder="password" />
					</div>
					<div className="relative">
						<FontAwesomeIcon
							icon={faKey}
							className="absolute top-[40%] left-[7%] text-black w-[16px]" />
						<input
							type="password"
							{...register("repassword", {required: true, minLength: 8})}
							className="input-password-style rounded-br-[268px] rounded-tr-[37px] rounded-l-[80px]"
							placeholder="confirm" />
					</div>
				</div>
				<button
					type="submit"
					className="custom-shape btn-style w-[216px] h-[57px] bg-[var(--purple-color)] transition ease-in-out duration-700 bottom-[38px]" >
					Sign Up
				</button>
			</form>
		</div>
	);
});

export default Authenticate;