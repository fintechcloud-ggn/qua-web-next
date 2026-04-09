import { createHmac, timingSafeEqual } from "node:crypto"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { SESSION_COOKIE } from "@/lib/auth-constants"

export type SessionUser = {
  name: string
  email: string
  mobile: string
  city?: string
}

type SessionPayload = {
  user: SessionUser
  exp: number
  iat: number
}

type AuthInput = {
  mode: "signin" | "signup"
  name?: string
  email?: string
  mobile?: string
  city?: string
  password?: string
}

const AUTH_SECRET = process.env.AUTH_SECRET || "qua-dev-auth-secret-change-me"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

const DEMO_USER: SessionUser & { password: string } = {
  name: "Anu Sharma",
  email: "anu.sharma@example.com",
  mobile: "9876543210",
  city: "Gurugram",
  password: "123456",
}

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString("base64url")
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(value: string) {
  return createHmac("sha256", AUTH_SECRET).update(value).digest("base64url")
}

export function createSessionToken(user: SessionUser) {
  const payload: SessionPayload = {
    user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  }

  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  const signature = sign(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export function verifySessionToken(token?: string | null) {
  if (!token) {
    return null
  }

  const [encodedPayload, signature] = token.split(".")
  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = sign(encodedPayload)
  const expectedBuffer = Buffer.from(expectedSignature)
  const providedBuffer = Buffer.from(signature)

  if (expectedBuffer.length !== providedBuffer.length) {
    return null
  }

  if (!timingSafeEqual(expectedBuffer, providedBuffer)) {
    return null
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as SessionPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload.user
  } catch {
    return null
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return verifySessionToken(token)
}

export async function requireSessionUser() {
  const user = await getSessionUser()
  if (!user) {
    redirect("/?auth=1")
  }
  return user
}

export function authenticateUser(input: AuthInput) {
  const email = input.email?.trim().toLowerCase() || ""
  const mobile = input.mobile?.trim() || ""
  const password = input.password?.trim() || ""

  if (input.mode === "signin") {
    const matchesIdentity = email === DEMO_USER.email || mobile === DEMO_USER.mobile
    const matchesPassword = password === DEMO_USER.password

    if (!matchesIdentity || !matchesPassword) {
      return null
    }

    return {
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      mobile: DEMO_USER.mobile,
      city: DEMO_USER.city,
    } satisfies SessionUser
  }

  const name = input.name?.trim() || ""
  if (name.length < 2 || !email || mobile.length < 10 || password.length < 6) {
    return null
  }

  return {
    name,
    email,
    mobile,
    city: input.city?.trim() || "",
  } satisfies SessionUser
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  }
}
