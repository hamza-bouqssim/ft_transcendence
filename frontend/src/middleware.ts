import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// async function isAuth(token: string): Promise<boolean> {
//   try {
//     const apiUrl = 'http://localhost:8000/auth/isAuth';
//     const response = await axios.post(apiUrl, { token }, {
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.status === 200) {
//       const result = response.data;
//       return result.isAuth === true;
//     } else {
//       console.error('Authentication failed:', response.status, response.statusText);
//       return false;
//     }
//   } catch (error) {
//     console.error('Error during authentication:', error.message);
//     return false;
//   }
// }

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/signIn', req.url).toString());
  }

  // try {
  //   const isAuthResult = await isAuth(token);

  //   if (!isAuthResult) {
  //     return NextResponse.redirect(new URL('/signIn', req.url).toString());
  //   }

    return NextResponse.next();
  // } catch (error) {
  //   console.error('Error during middleware execution:', error.message);
  //   return NextResponse.error();
  // }
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/chat',
    '/dashboard/groups',
    '/dashboard/groups/:id*'
  ],
};