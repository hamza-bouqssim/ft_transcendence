/* eslint-disable react/display-name */
import { forwardRef, useRef, useState } from "react";
import { SignButton } from "./Buttons";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { UserCredentialsParams } from "../utils/types";
import { postLoginUser } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Email, Key, Visibility, VisibilityOff } from "@mui/icons-material";

const SignInForm = forwardRef((props: any, ref: any) => {
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
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

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
	const router = useRouter();

	const onSubmit = async (data: UserCredentialsParams) => {
		try {
			await postLoginUser(data).then((res) => {
				if (res.data.success) router.push("/dashboard/settings");
				else if (!res.data.success) router.push("/signIn/verify-two-factor");
				else if (res.data.signed) router.push("/dashboard");
			});
			ToastSuccess(`You are signIn succefully`);
		} catch (err: any) {
			if (err.response) {
				const errorMessage = err.response.data.message;
				ToastError(`Failed to login: ${errorMessage}`);
			} else if (err.request) {
				ToastError(`No response from the server`);
			} else {
				ToastError(`Error in request setup`);
			}
		}
	};

	return (
		<div ref={ref}>
			<ToastContainer />
			<form
				action=""
				className="relative flex h-full w-full flex-col items-center justify-center gap-3 sm:gap-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="relative">
					<Email className="icon-style left-[30px]" />
					<input
						type="email"
						{...register("email", { required: "Email is required" })}
						className="custom-shape input-style"
						placeholder="Email"
					/>
				</div>
				<div className="relative">
					<Key className="icon-style left-[30px]" />
					<input
						type={show ? "text" : "password"}
						{...register("password", {
							required: "Password is required",
						})}
						className="custom-shape input-style"
						placeholder="Password"
					/>
					<Visibility
						ref={faEyeRef}
						className="icon-style right-[8%] block cursor-pointer"
						onClick={(e) => handleClick(e)}
					/>
					<VisibilityOff
						ref={faEyeSlashRef}
						className="icon-style right-[8%] hidden cursor-pointer"
						onClick={(e) => handleClick(e)}
					/>
				</div>
				<SignButton value={"Sign In"} />
			</form>
		</div>
	);
});
export default SignInForm;
