// middleware.ts
import { NextRequest, NextResponse } from "next/server";
// import Cookies from "js-cookie";

// Middleware function to check for authentication token
export function middleware(req: NextRequest) {
  const token = req.cookies.get("Firebase_token");
  //   console.log(token);

  // If no token exists, redirect the user to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If token exists, proceed with the request
  return NextResponse.next();
}

// Define which paths to apply the middleware (e.g., `/protected/*` routes)
export const config = {
  matcher: ["/popular", "/profile", "/details"], // Apply middleware to routes like `/protected/` (and its sub-routes)
};
