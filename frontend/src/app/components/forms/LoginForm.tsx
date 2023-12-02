"use client";

import { InputField, InputLabel } from "@/app/utils/styles";
import { InputContainer } from "@/app/utils/styles";
import { Button } from "@/app/utils/styles";
import styles from "./index.module.scss";
import Link from "next/link";
import { UserCredentialsParams } from "@/app/utils/types";
import { useForm } from "react-hook-form";
import { postLoginUser } from "@/app/utils/api";
import { useRouter } from "next/navigation";

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserCredentialsParams>();

	const router = useRouter();

	const onSubmit = async (data: UserCredentialsParams) => {
		try {
			await postLoginUser(data);
			router.push("/dashboard", { scroll: false });
		} catch (err) {
			alert("failed to login");
		}
	};
	return (
		<div className="custom-shape absolute transition-all duration-700 ease-in-out sm:left-[40%] md:bg-white md:px-8 md:py-8">
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
					<InputContainer className={styles.inputPass}>
						<InputLabel htmlFor="password">Password </InputLabel>
						<InputField
							type="password"
							id="password"
							{...register("password", { required: "Password is required" })}
						/>
					</InputContainer>

					<Button className={styles.btn}>Login</Button>
					<div className={styles.user}>
						<span>Dont have an account ? </span>
						<Link href="/dashboard/AuthenticationPage/RegisterPage">
							Sign Up
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
