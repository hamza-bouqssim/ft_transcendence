import Image from "next/image";
import {  loginGoogle } from "../utils/api";
import { UserCredentialsParams } from "../utils/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import LogOut from "./LogOut";
import Link from "next/link";
import { useContext } from "react";
import { socketContext } from "../utils/context/socketContext";

export const GoogleSignInButton = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const onSubmit = async (data: UserCredentialsParams) => {
		try {
			await loginGoogle();
		} catch (err) {
			alert("failed to login");
		}
	};

	return (
		<button>
			<Image
				className="w-5 hover:scale-150 hover:transform hover:transition hover:duration-300 hover:ease-in-out sm:w-6 md:w-7 2xl:w-[38px]"
				src={require("../../../public/assets/google.svg")}
				width={40}
				height={40}
				alt={"google"}
				priority={true}
			/>
		</button>
	);
};

export const IntraSignInButton = () => {
	return (
		<button>
			<Image
				className="w-5 hover:scale-150 hover:transform hover:transition hover:duration-300 hover:ease-in-out sm:w-6 md:w-7 2xl:w-[38px]"
				src={require("../../../public/assets/42-auth.svg")}
				width={40}
				height={40}
				alt={"intra42"}
				priority={true}
			/>
		</button>
	);
};


export const SignButton = (props: any) => {
	return (
		<button
			type="submit"
			className="custom-shape btn-style bg-[var(--purple-color)] text-[.7rem] transition duration-700 ease-in-out sm:text-sm md:w-[166px] md:py-4 md:text-[1rem]"
		>
			{props.value}
		</button>
	);
};

export const MenuButton = (props: any) => {
	return (
    <Link
      href={props.value === "Settings" ? "/dashboard/settings" : "/dashboard"}
      className={`h-[35px] w-[225px] ${props.background} ${
        props.value === "Logout" ? "text-white" : "text-black"
      } flex items-center justify-center rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`}
    >
      {props.value}
    </Link>
  );
};

export const MenuButton2 = (props: any) => {
	return (
		<button
			className={`h-[35px] w-[197px] ${props.background} rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`}
		>
			{props.value}
		</button>
	);
};

// export const LogoutButton = (props: any) => {
// 	return (
// 		<button
// 			onClick={hanldeLogOut}
// 			className={`h-[35px] w-[225px] ${props.background} ${
// 				props.value === "Logout" ? "text-white" : "text-black"
// 			} rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`}
// 		>
// 			{props.value}
// 		</button>
// 	);
// };

export const GoToProfileBtn = (props: any) => {
	const router = useRouter();

	const handleFunction = () => {
		router.push("/dashboard", { scroll: false });
	};
	return (
		<button
			onClick={handleFunction}
			className={`h-[35px] w-[225px] ${props.background} ${
				props.value === "Logout" ? "text-white" : "text-black"
			} rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`}
		>
			{props.value}
		</button>
	);
};
