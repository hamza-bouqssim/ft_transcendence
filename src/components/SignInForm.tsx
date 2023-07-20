import { forwardRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const SignInForm = forwardRef( (props: any, ref: any) => {

	type FormData = {
		email: string;
		password: string;
	};

	const { register, handleSubmit, formState: {errors} } = useForm<FormData>();

	const onSubmit: SubmitHandler<FormData> = (data) =>  {

		const emailInput = ref.current?.querySelector('input[type="email"]'),
				passInput = ref.current?.querySelector('input[type="password"]');

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
	};

// console.log(errors);
	return (
		<div ref={ref}>
			<form
				action=""
				className="relative h-full w-full flex items-center justify-center flex-col gap-3 sm:gap-4"
				onSubmit={handleSubmit(onSubmit)} >
				<div className="relative">
					<FontAwesomeIcon icon={faEnvelope} className="absolute top-[50%] left-[10%] transform translate-y-[-50%] text-black text-[.7rem] md:text-sm" />
					<input
						type="email"
						className="custom-shape input-style" placeholder="email"
						{...register("email") } />
				</div>
				<div className="relative">
					<FontAwesomeIcon icon={faKey} className="absolute top-[50%] left-[10%] transform translate-y-[-50%] text-black text-[.7rem] md:text-sm" />
					<input
						type="password"
						className="custom-shape input-style" placeholder="password"
						{...register("password")}  />
				</div>
				<button type="submit" className="custom-shape btn-style text-[.7rem] bg-[var(--purple-color)] transition ease-in-out duration-700 sm:text-sm md:text-[1rem] md:py-4 md:w-[166px]" >
					Sign In
				</button>
			</form>
		</div>
	);
});
export default SignInForm;