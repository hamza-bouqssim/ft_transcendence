import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  try {
    const token = request.cookies.get('token')?.value;
    if(token)
      return NextResponse.next();
    else
      return NextResponse.redirect(new URL('/signIn', request.url).toString());
  } catch (error) {
    return NextResponse.redirect(new URL('/signIn', request.url).toString());
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};  
