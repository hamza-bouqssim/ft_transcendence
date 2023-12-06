import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
	/****If you want to get a cookie in the nextjs middleWare */
	// the name of the cookies here is 'logged'
	const cookie = req.cookies.get("token");
	// console.log('cookie', cookie);
	if (!cookie) return NextResponse.redirect(new URL("/signIn", req.url));
	// check if the first time
	// check if ther is the 2fa
}
// export const config = {
//     matcher : ["/dashboard", "/dashboard/chat", "/dashboard/game"],
// }
export const config = {
	matcher: ["/dashboard/:path*"],
};
