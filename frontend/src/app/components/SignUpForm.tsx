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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpForm = forwardRef((_props: any, ref: any) => {
	const ToastError = (message: any) => {
		toast.error(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000,
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };
	
	  const ToastSuccess = (message: any) => {
		toast.success(message, {
		  position: toast.POSITION.TOP_RIGHT,
		  autoClose: 5000,
		  hideProgressBar: false,
		  closeOnClick: true,
		  pauseOnHover: true,
		  draggable: true,
		});
	  };
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
		try {
			await postRegisterUser(data);
			ToastSuccess(`Welcome ${data.username}`);
			router.push("/signIn", { scroll: false });
		} catch (err :  any) {
			if (err.response) {
			
				const errorMessage = err.response.data.message;
			  ToastError(`Failed to login: ${errorMessage}`);
			  } else if (err.request) 
			  {
				ToastError(`No response from the server`);
  
			  } else {
				ToastError(`Error in request setup`);
			  }
		}
	};

	return (
		<div ref={ref} className="">
			<ToastContainer />
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
						{...register("display_name", {
							required: "Display Name is required",
						})}
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
						{...register("password_hashed", {
							required: "Password is required",
						})}
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
SignUpForm.displayName = "SignUpForm";

export default SignUpForm;
