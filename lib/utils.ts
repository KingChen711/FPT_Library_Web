import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode"
import queryString from "query-string"
import { twMerge } from "tailwind-merge"

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

export function formatFileSize(bytes: number): string {
  if (bytes < 0) return "0 B"

  const units = ["B", "KB", "MB", "GB", "TB", "PB"]
  let unitIndex = 0

  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024
    unitIndex++
  }

  return `${bytes.toFixed(1)} ${units[unitIndex]}`
}

export async function fileUrlToFile(fileUrl: string, fileName: string) {
  // Fetch the file from the URL
  const response = await fetch(fileUrl)

  // Ensure the response is OK
  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${response.statusText}`)
  }

  // Get the file blob from the response
  const blob = await response.blob()

  // Create a File object from the blob
  return new File([blob], fileName, { type: blob.type })
}

export const convertGenderToNumber = (gender: string) => {
  switch (gender) {
    case "Male":
      return 0
    case "Female":
      return 1
    case "Other":
      return 2
    default:
      return null
  }
}

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function isImageLinkValid(link: string): boolean {
  try {
    const url = new URL(link)
    const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/i
    return url.protocol === "https:" && imageUrlRegex.test(url.pathname)
  } catch {
    return false
  }
}
