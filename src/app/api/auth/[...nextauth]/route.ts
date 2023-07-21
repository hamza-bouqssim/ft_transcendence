import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import FortyTwoProvider from "next-auth/providers/42-school";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		}),
		FortyTwoProvider({
			clientId: process.env.FORTY_TWO_CLIENT_ID as string,
			clientSecret: process.env.FORTY_TWO_CLIENT_SECRET as string
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string
		}),
	]
})

export { handler as GET, handler as POST }