import { NextResponse } from "next/server"

import { SESSION_COOKIE } from "@/lib/auth-constants"
import { authenticateUser, createSessionToken, getSessionCookieOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const body = (await request.json()) as {
    mode?: "signin" | "signup"
    name?: string
    email?: string
    mobile?: string
    city?: string
    password?: string
  }

  const mode = body.mode === "signup" ? "signup" : "signin"
  const user = authenticateUser({
    mode,
    name: body.name,
    email: body.email,
    mobile: body.mobile,
    city: body.city,
    password: body.password,
  })

  if (!user) {
    return NextResponse.json(
      { ok: false, message: mode === "signin" ? "Invalid login credentials." : "Please fill valid signup details." },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ ok: true, user })
  response.cookies.set(SESSION_COOKIE, createSessionToken(user), getSessionCookieOptions())
  return response
}
