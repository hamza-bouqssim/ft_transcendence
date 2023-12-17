import { NextRequest, NextResponse } from "next/server";

export function middleware(req : NextRequest)
{
    /****If you want to get a cookie in the nextjs middleWare */
    // the name of the cookies here is 'logged'
    const cookie = req.cookies.get('token');
    // console.log('cookie', cookie);
    if(!cookie)
        return NextResponse.redirect(new URL('/signIn', req.url))

}
export const config = {
    matcher : ["/dashboard/chat", "/dashboard/chat", "/dashboard/game"],
}
// export const config = {
//     matcher : ["/dashboard", "/dashboard/chat"],
// }



// export function middleware(req: NextRequest) {
// 	/****If you want to get a cookie in the nextjs middleWare */
// 	// the name of the cookies here is 'logged'
// 	const cookie = req.cookies.get("token");
// 	// console.log('cookie', cookie);
// 	// can you check the validation of he cookie { do an request to the backend and check the token}
// 	if (!cookie) return NextResponse.redirect(new URL("/signIn", req.url));
// 	// check if the first time
// 	// check if ther is the 2fa
// }
// // export const config = {
// //     matcher : ["/dashboard", "/dashboard/chat", "/dashboard/game"],
// // }
// export const config = {
// 	matcher: ["/dashboard/:path*"],
// };
