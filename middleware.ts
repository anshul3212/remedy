

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  /* ================= TOKEN ================= */

  const token =
    req.cookies.get("admin-token")?.value;

  /* ================= CURRENT PATH ================= */

  const { pathname } = req.nextUrl;

  /* ================= PUBLIC ROUTES ================= */

  const publicRoutes = [
    "/login",
    "/forget-password",
    "/logo.png"
  ];

  const isPublicRoute =
    publicRoutes.includes(pathname);

  /* ================= REDIRECT TO LOGIN ================= */

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  /* ================= REDIRECT LOGGED USER ================= */

  if (token && pathname === "/login") {
    return NextResponse.redirect(
      new URL("/users", req.url)
    );
  }

  return NextResponse.next();
}

/* ================= MATCHER ================= */

export const config = {
  matcher: [
    /*
      Exclude:
      - api
      - _next
      - favicon
      - static files
    */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};