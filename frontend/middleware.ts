// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const token = req.cookies.get("jwt")?.value;

	// List of routes to protect
	const protectedRoutes = ["/dashboard", "/user-administration"];

	if (protectedRoutes.includes(req.nextUrl.pathname)) {
		if (!token || !isTokenValid(token)) {
			return NextResponse.redirect(new URL("/", req.url));
		}
	}

	return NextResponse.next();
}

function isTokenValid(token: string) {
	try {
		// TODO: Replace with your real validation (e.g. JWT verify)
		return true;
	} catch (err) {
		return false;
	}
}

export const config = {
	matcher: ["/dashboard", "/user-administration"], // match only these routes
};
