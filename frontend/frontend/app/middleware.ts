import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isConnected = request.cookies.get("espConnected")?.value === "true"
  const pathname = request.nextUrl.pathname

  if (pathname === "/" && !isConnected) {
    return NextResponse.redirect(new URL("/configure", request.url))
  }

  // Allow configure page always
  if (pathname === "/configure") {
    return NextResponse.next()
  }

  // Protect other dashboard routes - redirect to configure if not connected
  if (!isConnected) {
    return NextResponse.redirect(new URL("/configure", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard", "/api/:path*"],
}
