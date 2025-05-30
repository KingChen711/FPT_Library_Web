import { clsx, type ClassValue } from "clsx"
import { addDays, format, isValid } from "date-fns"
import { jwtDecode } from "jwt-decode"
import queryString from "query-string"
import { twMerge } from "tailwind-merge"

import cutterData from "./cutter-data.json"

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

export const formatDateInput = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const getClientSideCookie = (name: string): string | undefined => {
  if (typeof document === "undefined" || typeof document.cookie === undefined)
    return undefined
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
  updates: queryString.ParsedQuery<string>
  url?: string
}) {
  const query = queryString.parse(params)

  Object.keys(updates).forEach((key) => {
    if (JSON.stringify(updates[key]) === JSON.stringify(["null", "null"])) {
      query[key] = null
      return
    }
    if (updates[key] === "") {
      query[key] = null
      return
    }
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
  return Math.round(price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  })
}

export function getDateRangeString(days: number): string {
  const today = new Date()
  const futureDate = addDays(today, days)

  const formattedToday = format(today, "dd/MM/yyyy")
  const formattedFutureDate = format(futureDate, "dd/MM/yyyy")

  return `${formattedToday} - ${formattedFutureDate}`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 0) return "0 B"

  const units = ["KB", "MB", "GB", "TB", "PB"]
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

export function generateCutter(name: string) {
  const suffix = ""

  const sp = "".toLowerCase().replace(/\W/, "")
  name = name.toLowerCase().replace(/\W/, "")

  const format = (num: string) => {
    const ch = name.toUpperCase().slice(0, 4 - num.length)
    return `${ch}${num}${suffix}`
  }

  let letters = "abcdefghijklmnopqrstuvwxyz".split("")
  letters = letters.slice(0, letters.indexOf(sp[0]) + 1)
  for (const c of letters.reverse()) {
    const key = `${name},${c}.`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const num: string | undefined = cutterData[key]
    if (num) {
      return format(num)
    }
  }

  let key = name
  while (key) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const num: string | undefined = cutterData[key]
    if (num) {
      return format(num)
    }
    key = key.slice(0, key.length - 1)
  }
  return ""
}

export function pascalToCamel(str: string): string {
  if (!str) return str // Handle empty string
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function splitCamelCase(text: string): string {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2")
}

export const formatLeftTime = (seconds: number) => {
  const floorSeconds = Math.floor(seconds)

  const minutes = Math.floor(floorSeconds / 60)
  const remainingSeconds = floorSeconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

export const getFullName = (
  firstName: string | null | undefined,
  lastName: string | null | undefined
) => {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim()
}

export const hashFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Kiểm tra ngày hợp lệ với input là day, month, year.
 * Nếu year là undefined, thì chấp nhận ngày hợp lệ trong mọi năm.
 */
export function isValidDate(
  day: number,
  month: number,
  year?: number
): boolean {
  // Kiểm tra phạm vi hợp lệ của day và month
  if (day < 1 || month < 1 || month > 12) return false

  // Nếu year được cung cấp, sử dụng date-fns để kiểm tra
  if (year !== undefined) {
    const date = new Date(year, month - 1, day)
    return (
      isValid(date) &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    )
  }

  // Nếu year không được cung cấp, kiểm tra thủ công với năm nhuận giả định
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return day <= daysInMonth[month - 1]
}
