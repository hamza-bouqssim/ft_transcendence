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
	faUser,
	faAddressCard,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import SignInForm from "./SignInForm";
import { createUserParams } from "../utils/types";
import { postRegisterUser } from "../utils/api";
import { useRouter } from "next/navigation";

const SignUpForm = forwardRef((props: any, ref: any) => {
	const [show, setShow] = useState<boolean>(false),
		faEyeRef = useRef<SVGSVGElement>(null),
		faEyeSlashRef = useRef<SVGSVGElement>(null);

	type FormData = {
		email: string;
		password: string;
		repassword: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<createUserParams>();
	const router = useRouter();

	const onSubmit = async (data: createUserParams) => {
		console.log(data);
		try {
			await postRegisterUser(data);
			alert(`Welcome ${data.username}`);
			router.push("/signIn", { scroll: false });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div ref={ref} className="">
			<form
				action=""
				className="relative flex h-full w-full flex-col items-center justify-center gap-3 sm:gap-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="relative">
					<FontAwesomeIcon icon={faUser} className="icon-style left-[30px]" />
					<input
						type="text"
						id="username"
						className="custom-shape input-style"
						placeholder="UserName"
						{...register("username", { required: "username is required" })}
					/>
				</div>
				<div className="relative">
					<FontAwesomeIcon
						icon={faAddressCard}
						className="icon-style left-[30px]"
					/>
					<input
						type="text"
						id="display_name"
						className="custom-shape input-style"
						placeholder="Display Name"
						{...register("display_name", { required: "Display Name is required" })}
					/>
				</div>
				<div className="relative">
					<FontAwesomeIcon
						icon={faEnvelope}
						className="icon-style left-[30px]"
					/>
					<input
						type="email"
						id="email"
						className="custom-shape input-style"
						placeholder="Email"
						{...register("email", { required: "Email is required" })}
					/>
				</div>
				<div className="relative">
					<FontAwesomeIcon icon={faKey} className="icon-style left-[30px]" />
					<input
						type={show ? "text" : "password"}
						id="password_hashed"
						{...register("password_hashed", { required: "Password is required" })}
						className="custom-shape input-style"
						placeholder="Passsword"
					/>
					<FontAwesomeIcon
						ref={faEyeRef}
						icon={show ? faEye : faEyeSlash}
						className="icon-style right-[10%] block cursor-pointer"
						onClick={() => setShow(!show)}
					/>
				</div>
				<SignButton value={"Sign Up"} />
			</form>
		</div>
	);
});

export default SignUpForm;