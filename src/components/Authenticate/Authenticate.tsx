"use client";
import Image from "next/image";
import "./Authenticate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import PingPong from "@/PingPong";
import { ChangeEvent, useState } from "react";

const Authenticate = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [rePassword, setRePassword] = useState<string>("");

	let container: HTMLElement | null,
		subContainer: HTMLElement | null,
		btnSignUp: HTMLElement | null,
		btnSignIn: HTMLElement | null,
		signUp: HTMLElement | null,
		signIn: HTMLElement | null;

	// window.addEventListener("load", () => {
	// 	container = document.getElementById("container");
	// 	subContainer = document.getElementById("sub-container");
	// 	btnSignUp = document.getElementById("btn-sign-up");
	// 	btnSignIn = document.getElementById("btn-sign-in");
	// 	signUp = document.getElementById("sign-up");
	// 	signIn = document.getElementById("password");
	// });

	const imgArr = ["/assets/google.svg", "/assets/42.svg", "/assets/github.svg"];

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

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {

		switch (e.target.name) {
		case "email":
			{
				setEmail(e.target.value);
				break;
			}
		case "password":
			setPassword(e.target.value);
			break;
		case "repassword":
			setRePassword(e.target.value);
			break;
		}
		// if (fieldVal.length > 0 && fieldVal.length < 8) e.target.style.border = "2px solid red"
	};

	// const validateForm = () => {};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		let SignUpStyle: CSSStyleDeclaration,
			SignInStyle: CSSStyleDeclaration;

		if (
		container &&
		subContainer &&
		btnSignUp &&
		btnSignIn &&
		signUp &&
		signIn
		) {
		if (
			e.currentTarget.textContent === "Sign Up" &&
			getComputedStyle(e.currentTarget).backgroundColor == "rgb(224, 224, 224)"
		) {
			container.style.transform = "rotate(-90deg)";
			subContainer.style.transform = "rotate(90deg)";

			SignUpStyle = getComputedStyle(e.currentTarget);
			SignInStyle = getComputedStyle(btnSignIn);

			btnSignIn.style.backgroundColor = SignUpStyle.backgroundColor;
			btnSignIn.style.color = SignUpStyle.color;

			btnSignUp.style.backgroundColor = SignInStyle.backgroundColor;
			btnSignUp.style.color = SignInStyle.color;

			signIn.style.display = "none";
			signUp.style.display = "block";
		} else if (
			e.currentTarget.textContent === "Sign In" &&
			getComputedStyle(e.currentTarget).backgroundColor == "rgb(224, 224, 224)"
		) {
			container.style.transform = "rotate(0deg)";
			subContainer.style.transform = "rotate(0deg)";

			SignInStyle = getComputedStyle(e.currentTarget);
			SignUpStyle = getComputedStyle(btnSignUp);

			btnSignIn.style.backgroundColor = SignUpStyle.backgroundColor;
			btnSignIn.style.color = SignUpStyle.color;

			btnSignUp.style.backgroundColor = SignInStyle.backgroundColor;
			btnSignUp.style.color = SignInStyle.color;

			signIn.style.display = "block";
			signUp.style.display = "none";
		}
		}
	};

	return (
		// <section id="authenticate" className="custom-shape relative top-1/2 left-[370px] transform translate-y-[-50%] w-fit">
		<PingPong id='authenticate' className="relative h-[100vh]">
			<div className="bg-red-500"></div>
			<h1 className="text-white absolute">This Is Just A Test!</h1>
			{/* <section id="authenticate" className="relative h-[100vh] flex items-center custom-shape py-[59px] px-[15%]"> */}
		{/* <div className="bg-red-800 flex items-center justify-center">
			<div
			id="container"
			className="custom-shape bg-white h-[777px] w-[683px] top-[50px] flex flex-col items-center justify-center transition ease-in-out duration-300 shadow-[0_0_20px_2px_black]"
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
				<form
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
					type="email"
					name="email"
					id="email"
					className="absolute custom-shape input-style top-[26px]"
					placeholder="email"
					onChange={ (e) => handleInputChange(e) }
				/>
				<FontAwesomeIcon
					icon={faKey}
					className="absolute top-[127px] left-[25px] text-black w-[16px] z-[1]"
				/>
				<input
					type="password"
					name="password"
					id="password"
					className="absolute custom-shape input-style top-[104px]"
					placeholder="password"
					onChange={ (e) => handleInputChange(e) }
				/>
				<div
					id="sign-up"
					className="hidden absolute w-[403px] h-[59px] top-[104px]"
				>
					<input
					type="password"
					name="password"
					id="password-sign-up"
					className="px-[55px] absolute rounded-bl-[37px] rounded-tl-[268px] rounded-r-[80px] text-black text-xl border-solid border-2 border-[#8E8E8E] w-[197px] h-[59px]"
					placeholder="password"
					onChange={ (e) => handleInputChange(e) }
					/>
					<FontAwesomeIcon
					icon={faKey}
					className="absolute top-[23px] left-[230px] text-black w-[16px] z-[1]"
					/>
					<input
					type="password"
					name="repassword"
					id="repassword"
					className="px-[55px] absolute rounded-br-[268px] rounded-tr-[37px] rounded-l-[80px] text-black text-xl border-solid border-2 border-[#8E8E8E] w-[197px] h-[59px] right-0"
					placeholder="Confirm"
					onChange={ (e) => handleInputChange(e) }
					/>
				</div>
				<button
					type="submit"
					className="absolute custom-shape btn-style w-[216px] h-[57px] bg-[var(--purple-color)] transition ease-in-out duration-700 bottom-[38px]"
				>
					Sign In
				</button>
				</form>
			</div>
			</div>
		</div> */}
		{/* </section> */}
		</PingPong>
	);
};

export default Authenticate;
