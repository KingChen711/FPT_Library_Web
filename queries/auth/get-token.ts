import { cookies } from "next/headers"

import "server-only"

export async function getToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value ?? null
  return token
}
