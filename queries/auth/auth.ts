import "server-only"

import { cookies } from "next/headers"
import { redirect } from "@/i18n/routing"
import jwt from "jsonwebtoken"
import { getLocale } from "next-intl/server"

import { ERole } from "@/lib/types/enums"

interface DecodedToken {
  userId: string
  email: string
  role: ERole
  exp: number
  iat: number
}

function verifyToken(token: string): DecodedToken | null {
  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as DecodedToken

    return verified
  } catch {
    return null
  }
}

let isAuthenticated = false
let role: ERole | null = null
const isAdmin = () => role === ERole.ADMIN
const isStaff = () => role === ERole.STAFF
const isTeacher = () => role === ERole.TEACHER
const isStudent = () => role === ERole.STUDENT
const getToken = () => {
  const cookieStore = cookies()
  const token = cookieStore.get("accessToken")?.value ?? null
  return token
}
const protect = async (inputRole?: ERole) => {
  if (!isAuthenticated) {
    redirect({
      href: "/login",
      locale: await getLocale(),
    })
  }

  if (!role) return

  if (role !== inputRole)
    redirect({
      href: "/",
      locale: await getLocale(),
    })
}

export const auth = () => {
  const token = getToken()

  if (!token) {
    isAuthenticated = false
    role = null
  } else {
    const decodeToken = verifyToken(token)
    if (!decodeToken) {
      isAuthenticated = false
      role = null
    } else {
      isAuthenticated = true
      role = decodeToken.role
    }
  }

  return {
    isAuthenticated,
    role,
    isAdmin,
    isStaff,
    isTeacher,
    isStudent,
    getToken,
    protect,
  }
}
