import { forwardRef, useRef, useState } from "react";
import { SignButton } from "./Buttons";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignInForm = forwardRef( (props: any, ref: any) => {
	const [show, setShow] = useState<boolean>(false),
			faEyeRef = useRef<SVGSVGElement>(null),
			faEyeSlashRef = useRef<SVGSVGElement>(null);

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

	const handleClick = (e: any): void => {
		if (e.currentTarget === faEyeRef.current)
		{
			faEyeRef.current?.classList.replace('block', 'hidden');
			faEyeSlashRef.current?.classList.replace('hidden', 'block');
		}
		else
		{
			faEyeSlashRef.current?.classList.replace('block', 'hidden');
			faEyeRef.current?.classList.replace('hidden', 'block');
		}
		setShow(!show);
	};

// console.log(errors);
	return (
		<div ref={ref}>
			<form
				action=""
				className="relative h-full w-full flex items-center justify-center flex-col gap-3 sm:gap-4"
				onSubmit={handleSubmit(onSubmit)} >
				<div className="relative">
					<FontAwesomeIcon icon={faEnvelope} className="icon-style left-[10%]" />
					<input
						type="email"
						{...register("email") }
						className="custom-shape input-style"
						placeholder="Email" />
				</div>
				<div className="relative">
					<FontAwesomeIcon icon={faKey} className="icon-style left-[10%]" />
					<input
						type={show ? "text" : "password" }
						{...register("password")}
						className="custom-shape input-style"
						placeholder="Password" />
					<FontAwesomeIcon ref={faEyeRef} icon={faEye} className="icon-style block right-[10%] cursor-pointer" onClick={(e) => handleClick(e)} />
					<FontAwesomeIcon ref={faEyeSlashRef} icon={faEyeSlash} className="hidden icon-style right-[10%] cursor-pointer" onClick={(e) => handleClick(e)} />
				</div>
				<SignButton value={'Sign In'} />
			</form>
		</div>
	);
});
export default SignInForm;