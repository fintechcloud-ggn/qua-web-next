import { redirect } from "next/navigation"

import { getSessionUser } from "@/lib/auth"

export default async function AuthPage() {
  const user = await getSessionUser()
  redirect(user ? "/dashboard" : "/?auth=1")
}
