import { cookies } from "next/headers"

export async function GET() {
  await new Promise((res) => setTimeout(res, 3000))

  const cookieStore = cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken || !accessToken) return Response.json(null)

  return Response.json({ accessToken, refreshToken })
}
