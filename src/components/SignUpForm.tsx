import { forwardRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const SignUpForm = forwardRef((props: any, ref: any) => {

	type FormData = {
		email: string;
		password: string;
		repassword: string;
	};

	const { register, handleSubmit } = useForm<FormData>();

	const onSubmit: SubmitHandler<FormData> = (data) =>  {

		const emailInput = ref.current?.querySelector('input[type="email"]'),
				passInputList = ref.current?.querySelectorAll('input[type="password"]'),
				passInput = passInputList[0],
				rePassInput = passInputList[1];

		if (!data.email.length)
		{
			emailInput.parentNode.classList.add("animate-wiggle");
			emailInput.style.cssText = "border: 3px solid red";
			emailInput.parentNode.addEventListener( 'animationend', () => {
				emailInput.parentNode.classList.remove("animate-wiggle");
				emailInput.style.removeProperty("border");
			} );
		}
		if (!data.password.length)
		{
			passInput.parentNode.classList.add("animate-wiggle");
			passInput.style.cssText = "border: 3px solid red";
			passInput.parentNode.addEventListener( 'animationend', () => {
				passInput.parentNode.classList.remove("animate-wiggle");
				passInput.style.removeProperty("border");
			} );
		}
		if (!data.repassword.length)
		{
			rePassInput.parentNode.classList.add("animate-wiggle");
			rePassInput.style.cssText = "border: 3px solid red";
			rePassInput.parentNode.addEventListener( 'animationend', () => {
				rePassInput.parentNode.classList.remove("animate-wiggle");
				rePassInput.style.removeProperty("border");
			} );
		}
	}

	return (
		<div ref={ref} className="hidden">
			<form
				action=""
				className="relative h-full w-full flex items-center justify-center flex-col gap-3 sm:gap-4"
				onSubmit={handleSubmit(onSubmit)} >
				<div className="relative">
					<FontAwesomeIcon
						icon={faEnvelope}
						className="absolute top-[50%] left-[10%] transform translate-y-[-50%] text-black text-[.7rem] md:text-sm" />
					<input
						type="email"
						className="custom-shape input-style" placeholder="email"
						{...register("email") } />
				</div>
				<div className="relative w-56 flex justify-between sm:w-60 md:w-[17rem]" >
					<div className="relative">
						<FontAwesomeIcon
							icon={faKey}
							className="absolute top-[50%] left-[10%] transform translate-y-[-50%] text-black text-[.7rem] md:text-sm" />
						<input
							type="password"
							{...register("password")}
							className="input-password-style rounded-bl-[37px] rounded-tl-[268px] rounded-r-[40px]"
							placeholder="password" />
					</div>
					<div className="relative">
						<FontAwesomeIcon
							icon={faKey}
							className="absolute top-[50%] left-[10%] transform translate-y-[-50%] text-black text-[.7rem] md:text-sm" />
						<input
							type="password"
							{...register("repassword")}
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

export default SignUpForm;