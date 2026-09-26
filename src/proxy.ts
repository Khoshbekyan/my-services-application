import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  // 1. Եթե օգտատերը լոգին է եղել ու փորձում է մտնել հյուրի էջ ("/") կամ login/register
  if (token && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
    const response = NextResponse.redirect(new URL("/services", request.url))
    // Արգելում ենք քեշավորումը, որ տվյալները միշտ թարմ լինեն
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    return response
  }

  // 2. Եթե օգտատերը լոգին չի եղել (հյուր է), բայց փորձում է մտնել պաշտպանված էջեր
  if (!token && (pathname.startsWith("/profile") || pathname.startsWith("/bookings"))) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    return response
  }

  // 3. Մնացած բոլոր էջերի սովորական բացում (օրինակ՝ "/" հյուրերի համար կամ "/services" լոգին եղածների)
  const response = NextResponse.next()

  // Կոշտ արգելում ենք քեշավորումը բրաուզերի մակարդակով
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")

  return response
}

export const config = {
  // Ստուգում ենք բոլոր էջերը
  matcher: ["/", "/services", "/login", "/register", "/profile/:path*", "/bookings/:path*"],
}
