import { cookies } from "next/headers"

import "server-only"

export function getToken() {
  const cookieStore = cookies()
  const token = cookieStore.get("accessToken")?.value ?? null
  return token
}
