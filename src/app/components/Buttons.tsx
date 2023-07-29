import Image from "next/image"
import { signIn, signOut } from 'next-auth/react'

export const GoogleSignInButton = ()=> {

	return (
		<button onClick={() => signIn("google")}>
			<Image
				className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300 w-5 sm:w-6 md:w-7 2xl:w-[38px]"
				src={require("../../../public/assets/google.svg")}
				width={40}
				height={40}
				alt={"google"} />
		</button>
	)
}

export const IntraSignInButton = () => {
	return (
		<button>
			<Image
				className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300 w-5 sm:w-6 md:w-7 2xl:w-[38px]"
				src={require("../../../public/assets/42-auth.svg")}
				width={40}
				height={40}
				alt={"intra42"} />
		</button>
	)
}

export const GithubSignInButton = () => {
	return (
		<button onClick={() => signIn("github")}>
			<Image
				className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300 w-5 sm:w-6 md:w-7 2xl:w-[38px]"
				src={require("../../../public/assets/github.svg")}
				width={40}
				height={40}
				alt={"github"} />
		</button>
	)
}

export const SignButton = (props: any) => {
	return (
		<button
			type="submit"
			className="custom-shape btn-style text-[.7rem] bg-[var(--purple-color)] transition ease-in-out duration-700 sm:text-sm md:text-[1rem] md:py-4 md:w-[166px]" >
			{props.value}
		</button>
	);
}

export const MenuButton = (props: any) => {
	return (
		<button className={`w-[225px] h-[35px] ${props.background} ${(props.value === "Logout") ? "text-white" : 'text-black'} rounded-[15px] hover:bg-[rgba(0,0,0,.2)]`}>{props.value}</button>
	);
};
