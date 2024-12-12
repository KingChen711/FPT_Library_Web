import { cookies } from "next/headers"

import { http } from "@/lib/http"
import { isTokenExpiringSoon } from "@/lib/server-utils"

export async function GET() {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    const refreshToken = cookieStore.get("refreshToken")?.value

    if (!refreshToken || !accessToken) {
      throw new Error("Missing tokens")
    }

    if (!isTokenExpiringSoon(accessToken)) {
      console.log("not isTokenExpiringSoon", { accessToken, refreshToken })

      return Response.json({ accessToken, refreshToken })
    }

    //need to refresh token
    const { data } = await http.post<{
      accessToken: string
      refreshToken: string
    }>("/api/auth/refresh-token", { refreshToken })

    cookieStore.set("accessToken", data.accessToken)
    cookieStore.set("refreshToken", data.refreshToken)

    console.log("fine", data)
    return Response.json(data)
  } catch {
    return Response.json(null)
  }
}
