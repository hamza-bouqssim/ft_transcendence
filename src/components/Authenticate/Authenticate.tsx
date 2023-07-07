"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import "./Authenticate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Authenticate = () => {
	const [isHidden, setIsHidden] = useState<boolean>(false);

	// This Is For Form Validation :)

	type Inputs = {
		email: string;
		password: string;
		repassword: string;
	};

	const { register, handleSubmit } = useForm<Inputs>();

	// ###################################################################### //

	let container: HTMLElement | null,
		subContainer: HTMLElement | null,
		btnSignUp: HTMLElement | null,
		btnSignIn: HTMLElement | null,
		signUp: HTMLElement | null,
		signIn: HTMLElement | null;

	useEffect(() => {
		container = document.getElementById("container");
		subContainer = document.getElementById("sub-container");
		btnSignIn = document.getElementById("btn-sign-in");
		btnSignUp = document.getElementById("btn-sign-up");
		signUp = document.getElementById("sign-up");
		signIn = document.getElementById("password");
	}, []);

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
		if (
		container &&
		subContainer &&
		btnSignUp &&
		btnSignIn &&
		signUp &&
		signIn &&
		getComputedStyle(e.currentTarget).backgroundColor == "rgb(224, 224, 224)"
		) {
		if (e.currentTarget.textContent === "Sign Up") {
			container.style.transform = "rotate(-90deg)";
			subContainer.style.transform = "rotate(90deg)";

			btnSignIn.classList.remove("active-btn-style");
			btnSignIn.classList.add("disabled-btn-style");
			btnSignUp.classList.remove("disabled-btn-style");
			btnSignUp.classList.add("active-btn-style");

			signIn.style.display = "none";
			signUp.style.display = "block";
		} else if (e.currentTarget.textContent === "Sign In") {
			container.style.transform = "rotate(0deg)";
			subContainer.style.transform = "rotate(0deg)";

			btnSignIn.classList.remove("disabled-btn-style");
			btnSignIn.classList.add("active-btn-style");
			btnSignUp.classList.remove("active-btn-style");
			btnSignUp.classList.add("disabled-btn-style");

			signIn.style.display = "block";
			signUp.style.display = "none";
		}
		}
	};

	return (
		<div id="authenticate" className="absolute px-[15%]">
		<div
			id="container"
			className="mt-[160px] absolute custom-shape bg-white h-[777px] w-[683px] flex flex-col items-center justify-center transition ease-in-out duration-300 shadow-[0_0_20px_2px_black]"
		>
			<div
			id="sub-container"
			className="transition ease-in-out duration-700 flex flex-col items-center justify-center w-[100%] h-[100%] relative"
			>
			<div className="transition-all duration-300 origin-center w-[554px] h-[70px] bg-[var(--gray-color)] absolute rounded-tr-[37px] rounded-br-[268px] rounded-bl-[37px] rounded-tl-[268px] top-[213px] left-[64px] flex items-center justify-evenly">
				<button
				id="btn-sign-in"
				className="transition ease-in-out duration-500 bg-white text-black w-[264px] rounded-r-[120px] rounded-bl-[37px] rounded-tl-[268px] h-[57px] flex items-center justify-center"
				onClick={(e) => handleClick(e)}
				>
				Sign In
				</button>
				<button
				id="btn-sign-up"
				className="transition ease-in-out duration-500 bg-[#E0E0E0] text-[#949494] w-[264px] rounded-l-[120px] rounded-br-[268px] rounded-tr-[37px] h-[57px] flex items-center justify-center"
				onClick={(e) => handleClick(e)}
				>
				Sign Up
				</button>
			</div>
			<div className="w-[100%] absolute gap-[30px] top-[300px] flex justify-center items-center cursor-pointer">
				{icons}
			</div>
			{/* <form
				onSubmit={handleSubmit((data) => {
				console.log(data);
				})}
				action=""
				className="relative h-[280px] w-[403px] top-[116px] flex items-center justify-center flex-col border-solid border-t-[1px] border-[#8E8E8E]"
			>
				<span className="absolute top-[-14px] text-[#8E8E8E] bg-white px-1">
				OR
				</span>
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
				Sign In
				</button>
			</form> */}
			<SignIn  />
			<SignUp/>
			</div>
		</div>
		</div>
	);
};

// Sign In Component :)
const SignIn = () => {

	type Inputs = {
		email: string;
		password: string;
		repassword: string;
	};

	const { register, handleSubmit } = useForm<Inputs>();

	return (
		<form id='sign-in' onSubmit={handleSubmit( (data) => {
			console.log(data);
		} )}
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
};

// Sign Up Component :)
const SignUp = () => {

	type Inputs = {
		email: string;
		password: string;
		repassword: string;
	};

	const { register, handleSubmit } = useForm<Inputs>();

	return (
		<form
			id='sign-up'
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
};

export default Authenticate;