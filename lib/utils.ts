import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode"
import queryString from "query-string"
import { twMerge } from "tailwind-merge"

import { USER_GENDER } from "./types/models"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  return day
}

export const getClientSideCookie = (name: string): string | undefined => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1]

  return cookieValue
}

export function isTokenExpired(token: string): boolean {
  try {
    // Decode the token to get the payload
    const decoded = jwtDecode(token)

    // Check if `exp` exists in the payload
    if (!decoded.exp) {
      throw new Error("Token does not have an expiration date (exp).")
    }

    // Get the current timestamp (in seconds)
    const currentTimestamp = Math.floor(Date.now() / 1000)

    // Check if the token is expired
    return decoded.exp < currentTimestamp
  } catch {
    return true
  }
}

export function formUrlQuery({
  params,
  updates,
  url,
}: {
  params: string
  updates: Record<string, string | (string | null)[] | null>
  url?: string
}) {
  const query = queryString.parse(params)

  Object.keys(updates).forEach((key) => {
    query[key] = updates[key]
  })

  return queryString.stringifyUrl(
    {
      url: url ?? window.location.pathname,
      query,
    },
    { skipNull: true }
  )
}

export function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
}

export function convertUserGender(gender: USER_GENDER): number {
  switch (gender) {
    case USER_GENDER.MALE:
      return 0
    case USER_GENDER.FEMALE:
      return 1
    default:
      return 0
  }
}
