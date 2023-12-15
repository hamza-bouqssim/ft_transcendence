"use client";

import { InputField, InputLabel } from "@/app/utils/styles";
import { InputContainer } from "@/app/utils/styles";
import { Button } from "@/app/utils/styles";
import styles from "./index.module.scss";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { postRegisterUser } from "@/app/utils/api";
import { createUserParams } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
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
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<createUserParams>();
	const router = useRouter();

	const onSubmit = async (data: createUserParams) => {
		try {
			await postRegisterUser(data);
			ToastSuccess(`Welcome ${data.display_name}`);

			router.push("/dashboard/AuthenticationPage/LoginPage", { scroll: false });
		} catch (err) {
			ToastError(err);
		}
	};
	return (
		<div className="custom-shape absolute transition-all duration-700 ease-in-out sm:left-[40%] md:bg-white md:px-8 md:py-8">
				<ToastContainer />
			<div className="custom-shape flex flex-col items-center gap-4 bg-white px-4 py-7 transition-all duration-700 ease-in-out sm:gap-5 sm:px-9 sm:py-10 md:bg-transparent md:px-6 md:py-4 2xl:py-36">
				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<InputContainer>
						<InputLabel htmlFor="email">Email </InputLabel>
						<InputField
							type="email"
							id="email"
							{...register("email", { required: "Email is required" })}
						/>
					</InputContainer>
					<section className={styles.Row}>
						<InputContainer>
							<InputLabel htmlFor="firstName">FirstName </InputLabel>
							<InputField
								type="text"
								id="firstName"
								{...register("firstName", {
									required: "FirstName is required",
								})}
							/>
						</InputContainer>
						<InputContainer>
							<InputLabel htmlFor="lastName">LastName </InputLabel>
							<InputField
								type="text"
								id="lastName"
								{...register("lastName", { required: "LastName is required" })}
							/>
						</InputContainer>
					</section>
					<InputContainer>
						<InputLabel htmlFor="password">Password </InputLabel>
						<InputField
							type="password"
							id="password"
							{...register("password", { required: "Password is required" })}
						/>
					</InputContainer>

					<Button className={styles.btn}>Register</Button>
					<div className={styles.user}>
						<span>Already have an account ? </span>
						<Link href="/dashboard/AuthenticationPage/LoginPage">Login</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RegisterForm;
