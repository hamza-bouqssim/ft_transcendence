import Image from "next/image";
import { signIn, signOut } from "next-auth/react";

export const GoogleSignInButton = () => {
	return (
		<button onClick={() => signIn("google")}>
			<Image
				className="w-5 hover:scale-150 hover:transform hover:transition hover:duration-300 hover:ease-in-out sm:w-6 md:w-7 2xl:w-[38px]"
				src={require("../../../public/assets/google.svg")}
				width={40}
				height={40}
				alt={"google"}
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
			/>
		</button>
	);
};

export const GithubSignInButton = () => {
	return (
		<button onClick={() => signIn("github")}>
			<Image
				className="w-5 hover:scale-150 hover:transform hover:transition hover:duration-300 hover:ease-in-out sm:w-6 md:w-7 2xl:w-[38px]"
				src={require("../../../public/assets/github.svg")}
				width={40}
				height={40}
				alt={"github"}
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
		<button
			className={`h-[35px] w-[225px] ${props.background} ${
				props.value === "Logout" ? "text-white" : "text-black"
			} rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`}
		>
			{props.value}
		</button>
	);
};
