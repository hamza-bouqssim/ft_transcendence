import Image from "next/image"
import { signIn, signOut } from 'next-auth/react'

export const GoogleSignInButton = ()=> {

	return (
		<button onClick={() => signIn("google")}>
			<Image
				className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300 w-5 sm:w-6 md:w-7"
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
				className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300 w-5 sm:w-6 md:w-7"
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
				className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300 w-5 sm:w-6 md:w-7"
				src={require("../../../public/assets/github.svg")}
				width={40}
				height={40}
				alt={"github"} />
		</button>
	)
}