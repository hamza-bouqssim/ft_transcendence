import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';


export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    const isAuth = await isAuthfetch(token)
    if (!isAuth) {
      return NextResponse.redirect(new URL('/signIn', request.url).toString());
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/signIn', request.url).toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

async function isAuthfetch(token: string | undefined): Promise<boolean> {
  try {
    const apiUrl = 'http://api:8000/auth/isAuth';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ token: token }),
    });

    if (response.status === 200) {
      return  true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}