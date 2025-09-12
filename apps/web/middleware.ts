import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 🔒 Routes that require login
const protectedRoutes = ["/dashboard", "/settings", "/tasks"];

// 🌐 Routes that should be accessible without login
const publicRoutes = ["/", "/auth", "/about"];

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session"); // adjust based on your auth
  const { pathname } = req.nextUrl;

  // Check if current path starts with any protected route
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path starts with any public route
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  // 🔒 Block access to protected routes if not logged in
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // 🚀 Redirect logged-in users away from public routes like "/" or "/auth"
  if (isPublic && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware only to needed routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // run on all pages except static
};
