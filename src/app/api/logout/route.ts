// 📄 ՖԱՅԼ: app/api/logout/route.ts
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url))

  // Ջնջում ենք տոկենը բրաուզերից
  response.cookies.set("token", "", { 
    path: "/", 
    maxAge: 0 
  })

  return response
}
