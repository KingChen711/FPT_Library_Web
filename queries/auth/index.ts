import "server-only"

import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "@/i18n/routing"
import { getLocale } from "next-intl/server"

import { http } from "@/lib/http"
import { verifyToken } from "@/lib/server-utils"
import { EAccessLevel, EFeature } from "@/lib/types/enums"
import { type Employee, type User } from "@/lib/types/models"

let isAuthenticated = false
let userType: "user" | "employee" | null = null

const getAccessToken = () => {
  const cookieStore = cookies()
  const token = cookieStore.get("accessToken")?.value ?? null
  return token
}

const protect = async (feature?: EFeature) => {
  try {
    if (!isAuthenticated) {
      throw new Error("User is not authenticated")
    }

    if (!feature) return

    if (feature === EFeature.DASHBOARD_MANAGEMENT && userType === "user") {
      throw new Error(
        "User have type 'user' does not permission to access this feature"
      )
    }

    const accessLevel = await getAccessLevel(feature)
    if (accessLevel === EAccessLevel.ACCESS_DENIED) {
      throw new Error("User does not have permission to access this feature")
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    } else {
      console.log("Error: ", error)
    }
    redirect({
      href: "/login",
      locale: await getLocale(),
    })
  }
}

const whoAmI = cache(async (): Promise<User | Employee | null> => {
  try {
    const { data } = await http.get<User | Employee>("/api/auth/current-user", {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      next: {
        revalidate: 0,
        tags: ["who-am-i"],
      },
    })

    return data || null
  } catch {
    return null
  }
})

const getAccessLevel = async (feature: EFeature): Promise<EAccessLevel> => {
  try {
    const { data } = await http.get<{ permissionLevel: EAccessLevel }>(
      `/api/features/${feature}/authorized-permission`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        next: {
          revalidate: 0,
        },
      }
    )

    return data.permissionLevel || EAccessLevel.ACCESS_DENIED
  } catch {
    return EAccessLevel.ACCESS_DENIED
  }
}

export const havePermission = async (
  feature: EFeature,
  accessLevel: EAccessLevel
) => (await getAccessLevel(feature)) >= accessLevel

export const auth = () => {
  const token = getAccessToken()

  if (!token) {
    isAuthenticated = false
    userType = null
  } else {
    const decodeToken = verifyToken(token)
    if (!decodeToken) {
      isAuthenticated = false
      userType = null
    } else {
      isAuthenticated = true
      userType = decodeToken.userType
    }
  }

  return {
    isAuthenticated,
    userType,
    getAccessToken,
    protect,
    whoAmI,
    getAccessLevel,
  }
}
