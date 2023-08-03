import { forwardRef, useRef, useState } from "react";
import EmailInput from "./EmailInput";
import { SignButton } from "./Buttons";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faKey,
	faEnvelope,
	faEye,
	faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import SignInForm from "./SignInForm";

const SignUpForm = forwardRef((props: any, ref: any) => {
	const [show, setShow] = useState<boolean>(false),
		faEyeRef = useRef<SVGSVGElement>(null),
		faEyeSlashRef = useRef<SVGSVGElement>(null);

	type FormData = {
		email: string;
		password: string;
		repassword: string;
	};

	const { register, handleSubmit } = useForm<FormData>();

	const onSubmit: SubmitHandler<FormData> = (data) => {
		const emailInput = ref.current?.querySelector('input[type="email"]'),
			passInputList = ref.current?.querySelectorAll('input[type="password"]'),
			passInput = passInputList[0],
			rePassInput = passInputList[1];

		if (!data.email.length) {
			emailInput.parentNode.classList.add("animate-wiggle");
			emailInput.style.cssText = "border: 3px solid red";
			emailInput.parentNode.addEventListener("animationend", () => {
				emailInput.parentNode.classList.remove("animate-wiggle");
				emailInput.style.removeProperty("border");
			});
		}
		if (!data.password.length) {
			passInput.parentNode.classList.add("animate-wiggle");
			passInput.style.cssText = "border: 3px solid red";
			passInput.parentNode.addEventListener("animationend", () => {
				passInput.parentNode.classList.remove("animate-wiggle");
				passInput.style.removeProperty("border");
			});
		}
		if (!data.repassword.length) {
			rePassInput.parentNode.classList.add("animate-wiggle");
			rePassInput.style.cssText = "border: 3px solid red";
			rePassInput.parentNode.addEventListener("animationend", () => {
				rePassInput.parentNode.classList.remove("animate-wiggle");
				rePassInput.style.removeProperty("border");
			});
		}
	};

	const handleClick = (e: any): void => {
		if (e.currentTarget === faEyeRef.current) {
			faEyeRef.current?.classList.replace("block", "hidden");
			faEyeSlashRef.current?.classList.replace("hidden", "block");
		} else {
			faEyeSlashRef.current?.classList.replace("block", "hidden");
			faEyeRef.current?.classList.replace("hidden", "block");
		}
		setShow(!show);
	};

	return (
		<div ref={ref} className="hidden">
			<form
				action=""
				className="relative flex h-full w-full flex-col items-center justify-center gap-3 sm:gap-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="relative">
					<FontAwesomeIcon
						icon={faEnvelope}
						className="icon-style left-[30px]"
					/>
					<input
						type="email"
						className="custom-shape input-style"
						placeholder="Email"
						{...register("email")}
					/>
				</div>
				{/* <EmailInput {...register("email") } /> */}
				<div className="relative flex w-56 justify-between sm:w-60 md:w-[17rem] 2xl:w-[403px]">
					<div className="relative 2xl:w-[49%]">
						<FontAwesomeIcon icon={faKey} className="icon-style left-[30px]" />
						<input
							type={show ? "text" : "password"}
							{...register("password")}
							className="input-password-style rounded-r-[40px] rounded-bl-[37px] rounded-tl-[268px]"
							placeholder="Password"
						/>
						<FontAwesomeIcon
							ref={faEyeRef}
							icon={faEye}
							className="icon-style right-[10%] block cursor-pointer"
							onClick={(e) => handleClick(e)}
						/>
						<FontAwesomeIcon
							ref={faEyeSlashRef}
							icon={faEyeSlash}
							className="icon-style right-[10%] hidden cursor-pointer"
							onClick={(e) => handleClick(e)}
						/>
					</div>
					<div className="relative 2xl:w-[49%]">
						<FontAwesomeIcon icon={faKey} className="icon-style left-[30px]" />
						<input
							type={show ? "text" : "password"}
							{...register("repassword")}
							className="input-password-style rounded-l-[40px] rounded-br-[268px] rounded-tr-[37px]"
							placeholder="Confirm"
						/>
						<FontAwesomeIcon
							ref={faEyeRef}
							icon={faEye}
							className="icon-style right-[10%] block cursor-pointer"
							onClick={(e) => handleClick(e)}
						/>
						<FontAwesomeIcon
							ref={faEyeSlashRef}
							icon={faEyeSlash}
							className="icon-style right-[10%] hidden cursor-pointer"
							onClick={(e) => handleClick(e)}
						/>
					</div>
				</div>
				<SignButton value={"Sign Up"} />
			</form>
		</div>
	);
});

export default SignUpForm;
