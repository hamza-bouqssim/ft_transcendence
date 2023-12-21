import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	try {
		const token = request.cookies.get("token")?.value;
		if (!token) {
			return NextResponse.redirect(new URL("/signIn", request.url).toString());
		}
	} catch (error) {
		return NextResponse.redirect(new URL("/signIn", request.url).toString());
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
};

async function isAuthfetch(token: string | undefined): Promise<boolean> {
	try {
		const apiUrl = "http://localhost:8000/auth/isAuth";
		const response = await fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ token: token }),
		});

		if (response.status === 200) {
			const result = await response.json();
			return result.isAuthenticated === true;
		} else if (response.status === 401) {
			// Unauthorized - handle accordingly
			return false;
		} else {
			// Handle other HTTP status codes if needed
			console.error(`Unexpected response status: ${response.status}`);
			return false;
		}
	} catch (error) {
		console.error("Error during authentication check:", error);
		return false;
	}
}
