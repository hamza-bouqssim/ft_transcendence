import { NextRequest, NextResponse } from "next/server";

export function middleware(req : NextRequest)
{
    /****If you want to get a cookie in the nextjs middleWare */
    // the name of the cookies here is 'logged'
    const cookie = req.cookies.get('logged');
    console.log('cookie', cookie);
    if(!cookie)
        return NextResponse.redirect(new URL('/signIn', req.url))

}
export const config = {
    matcher : ["/dashboard/chat", "/dashboard/chat", "/dashboard/game"],
}
