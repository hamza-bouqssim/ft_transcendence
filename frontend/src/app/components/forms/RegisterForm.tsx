"use client";

import { InputField, InputLabel } from "@/app/utils/styles";
import { InputContainer } from "@/app/utils/styles";
import { Button } from "@/app/utils/styles";
// import styles from "./index.module.scss";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { postRegisterUser } from "@/app/utils/api";
import { createUserParams } from "@/app/utils/types";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
	// const {
	// 	register,
	// 	handleSubmit,
	// 	formState: { errors },
	// } = useForm<createUserParams>();
	// const router = useRouter();

	// const onSubmit = async (data: createUserParams) => {
	// 	try {
	// 		await postRegisterUser(data);
	// 		alert(`Welcome ${data.firstName}`);
	// 		router.push("/dashboard/AuthenticationPage/LoginPage", { scroll: false });
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };
	return <></>;
	// return (
	// 	<div className="custom-shape absolute transition-all duration-700 ease-in-out sm:left-[40%] md:bg-white md:px-8 md:py-8">
	// 		<div className="custom-shape flex flex-col items-center gap-4 bg-white px-4 py-7 transition-all duration-700 ease-in-out sm:gap-5 sm:px-9 sm:py-10 md:bg-transparent md:px-6 md:py-4 2xl:py-36">
	// 			<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
	// 				<InputContainer>
	// 					<InputLabel htmlFor="email">Email </InputLabel>
	// 					<InputField
	// 						type="email"
	// 						id="email"
	// 						{...register("email", { required: "Email is required" })}
	// 					/>
	// 				</InputContainer>
	// 				<section className={styles.Row}>
	// 					<InputContainer>
	// 						<InputLabel htmlFor="firstName">FirstName </InputLabel>
	// 						<InputField
	// 							type="text"
	// 							id="firstName"
	// 							{...register("firstName", {
	// 								required: "FirstName is required",
	// 							})}
	// 						/>
	// 					</InputContainer>
	// 					<InputContainer>
	// 						<InputLabel htmlFor="lastName">LastName </InputLabel>
	// 						<InputField
	// 							type="text"
	// 							id="lastName"
	// 							{...register("lastName", { required: "LastName is required" })}
	// 						/>
	// 					</InputContainer>
	// 				</section>
	// 				<InputContainer>
	// 					<InputLabel htmlFor="password">Password </InputLabel>
	// 					<InputField
	// 						type="password"
	// 						id="password"
	// 						{...register("password", { required: "Password is required" })}
	// 					/>
	// 				</InputContainer>

	// 				<Button className={styles.btn}>Register</Button>
	// 				<div className={styles.user}>
	// 					<span>Already have an account ? </span>
	// 					<Link href="/dashboard/AuthenticationPage/LoginPage">Login</Link>
	// 				</div>
	// 			</form>
	// 		</div>
	// 	</div>
	// );
};

export default RegisterForm;

// "use client"

// import { InputField, InputLabel } from "@/app/utils/styles";
// import { InputContainer } from "@/app/utils/styles";

// import styles from "./index.module.scss"
// import Link from "next/link";
// import { Backend_URL } from "@/lib/Constants";
// import { useRef } from "react";
// import {BsGithub, BsGoogle}  from "react-icons/bs"
// import {SubmitHandler, FieldValues, useForm} from "react-hook-form"
// import { useState } from "react";
// import Input from "../input/input";
// import AuthSocialButton from "./AuthSocialButton";
// import Button from "../Button/Button";

// type FormInputs = {
//     name: string;
//     email: string;
//     password: string;
// };

// const Auth = () => {

//     const [Element, setElement] = useState('LOGIN');
//     const [isLoading, setIsLoading] = useState(false);

//     // we memorize this function by using useCallback()

//     const toggleElement = () => {
//         if(Element === 'LOGIN')
//         {
//             setElement('REGISTER');
//         }else
//         {
//             setElement('LOGIN');
//         }

//     }

//     //create react hook form submit function
//     const {register, handleSubmit, formState:{errors}} = useForm<FieldValues>({
//         defaultValues:{
//             name: '',
//             email: '',
//             password: ''
//         }
//     });

//     const onSubmit : SubmitHandler<FieldValues> = (data) =>
//     {
//         setIsLoading(true);
//         if(Element === 'REGISTER')
//         {

//         }
//         if(Element === 'LOGIN')
//         {

//         }
//     }

//     const socialAction = (action : string) => {
//         setIsLoading(true);
//     }

//     const FunctionTest = () =>
//     {
//         console.log("hello souchen");
//     }

//     return (

//             <div className="custom-shape absolute transition-all duration-700 ease-in-out sm:left-[40%] md:bg-white md:px-8 md:py-8">
//             <div className="custom-shape flex flex-col items-center gap-4 bg-white px-4 py-7 transition-all duration-700 ease-in-out sm:gap-5 sm:px-9 sm:py-10 md:bg-transparent md:px-6 md:py-4 2xl:py-36">
//                 <form className="space-y-6">
//                     {Element === 'REGISTER' &&
//                         <Input id="name" type="text" label="UserName" register={register} errors={errors} disabled={isLoading}  name="name"/>}
//                         <Input id="email" type="email" label="Email" register={register} errors={errors} disabled={isLoading}  name="email"/>
//                         <Input id="Password" type="password" label="Password" register={register} errors={errors} disabled={isLoading}   name="password"/>
//                         <div >
//                             <Button  type="submit" fullWidth disabled={isLoading}>{Element === 'LOGIN' ? 'Sign in' : 'Register'}</Button>
//                         </div>
//                 </form>
//                 <div className={styles.topClass}>
//                     <div className="relative">

//                             <div className="relative flex justify-center text-sm">
//                                     <span className="bg-white px-2 text-gray-500">Or continue with</span>
//                             </div>

//                         <div className="mt-6 flex gap-2">
//                                 <AuthSocialButton icon={BsGithub} onClick={()=> socialAction('github')}/>
//                                 <AuthSocialButton icon={BsGoogle} onClick={()=> socialAction('Google')}/>

//                         </div>
//                         <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
//                             <div >
//                                 {Element === 'LOGIN' ? 'New to PingPong?' : 'Already have an account'}
//                             </div>
//                             <div onClick={toggleElement} className="underline cursor-pointer">
//                                 {Element === 'LOGIN' ? 'Create an account' : 'Login'}
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>

//      );
// }

// export default Auth;
