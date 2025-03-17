import { type LocalStorageKeys } from "@/constants"
import { clsx, type ClassValue } from "clsx"
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

export const localStorageHandler = {
  getItem: (key: LocalStorageKeys) => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(key) ?? "[]")
  },

  setItem: (key: LocalStorageKeys, bookId: string) => {
    if (typeof window === "undefined") return

    const existingItemList = localStorage.getItem(key)
    let updatedList: string[] = []

    if (existingItemList) {
      const parsedItemList: string[] = JSON.parse(existingItemList)
      updatedList = parsedItemList.includes(bookId)
        ? parsedItemList.filter((id) => id !== bookId) // Xóa nếu đã có
        : [...parsedItemList, bookId] // Thêm nếu chưa có
    } else {
      updatedList = [bookId]
    }

    localStorage.setItem(key, JSON.stringify(updatedList))

    // 🔥 Phát sự kiện tùy chỉnh để cập nhật UI ngay trong cùng tab
    window.dispatchEvent(new Event(key))
  },

  addRecentItem: (key: LocalStorageKeys, bookId: string) => {
    if (typeof window === "undefined") return

    const recentItems = localStorage.getItem(key)
    let updatedRecentItems: string[] = []

    if (recentItems) {
      const parsedRecentItems: string[] = JSON.parse(recentItems)
      const filteredItems = parsedRecentItems.filter((id) => id !== bookId)
      updatedRecentItems = [bookId, ...filteredItems].slice(0, 5)
    } else {
      updatedRecentItems = [bookId]
    }

    localStorage.setItem(key, JSON.stringify(updatedRecentItems))
    window.dispatchEvent(new Event(key))
  },

  clear: (key: LocalStorageKeys) => {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
    window.dispatchEvent(new Event(key))
  },
}

export const hashFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
