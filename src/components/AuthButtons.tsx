import Image from "next/image"
import '../../public/assets/42-auth.svg'
import {signIn} from 'next-auth/react'

export const GoogleSignInButton = ()=> {
	const handleClick = () =>{
		signIn("google");
	}

	return (
		<button onClick={handleClick}>
			<Image
				className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300 w-5 sm:w-6 md:w-7"
				src={require("../../public/assets/google.svg")}
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
				src={require("../../public/assets/42-auth.svg")}
				width={40}
				height={40}
				alt={"42intra"} />
		</button>
	)
}

export const GithubSignInButton = () => {
	return (
		<button>
			<Image
				className="hover:transform hover:scale-150 hover:transition hover:ease-in-out hover:duration-300 w-5 sm:w-6 md:w-7"
				src={require("../../public/assets/github.svg")}
				width={40}
				height={40}
				alt={"github"} />
		</button>
	)
}