import "server-only"

import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "@/i18n/routing"
import { getLocale } from "next-intl/server"

import { http } from "@/lib/http"
import { verifyToken } from "@/lib/server-utils"
import { type Employee, type User } from "@/lib/types/models"

let isAuthenticated = false

const getAccessToken = () => {
  const cookieStore = cookies()
  const token = cookieStore.get("accessToken")?.value ?? null
  return token
}

const protect = async (feature?: string) => {
  if (!isAuthenticated) {
    redirect({
      href: "/login",
      locale: await getLocale(),
    })
  }

  //TODO:handle check feature
  console.log(feature)
}

const whoAmI = cache(async (): Promise<User | Employee | null> => {
  try {
    const { data } = await http.get<User | Employee>("/api/auth/current-user", {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      next: {
        revalidate: 60,
        tags: ["who-am-i"],
      },
    })

    return data || null
  } catch {
    return null
  }
})

export const auth = () => {
  const token = getAccessToken()

  if (!token) {
    isAuthenticated = false
  } else {
    const decodeToken = verifyToken(token)
    if (!decodeToken) {
      isAuthenticated = false
    } else {
      isAuthenticated = true
    }
  }

  return {
    isAuthenticated,
    getAccessToken,
    protect,
    whoAmI,
  }
}
