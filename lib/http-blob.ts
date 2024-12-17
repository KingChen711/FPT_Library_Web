/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getLocale } from "next-intl/server"

import { getClientSideCookie } from "./utils"

/* eslint-disable @typescript-eslint/no-explicit-any */
type CustomOptions = RequestInit & {
  baseUrl?: string
  lang?: string
  searchParams?: Record<string, string>
  responseType?: "json" | "blob"
}

type OkResponse<TData = undefined> = {
  resultCode: string
  message: string
  data: TData
}

class HttpError extends Error {
  resultCode: string
  type: "unknown" | "warning" | "error" | "form"
  fieldErrors: Record<string, string[]>
  constructor({
    fieldErrors,
    message,
    type,
    resultCode,
  }: {
    resultCode: string
    type: "unknown" | "warning" | "error" | "form"
    message?: string
    fieldErrors?: Record<string, string[]>
  } & (
    | {
        type: "unknown"
      }
    | {
        type: "warning" | "error"
        message: string
      }
    | {
        type: "form"
        fieldErrors: Record<string, string[]>
      }
  )) {
    super(message)
    this.type = type
    this.resultCode = resultCode
    this.fieldErrors = fieldErrors || {}
  }
}

const request = async <TData = undefined>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options?: CustomOptions
): Promise<TData> => {
  const body = options?.body ? JSON.stringify(options.body) : undefined
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": "",
  }

  // Set Accept-Language header
  if (typeof window === "undefined") {
    baseHeaders["Accept-Language"] = await getLocale()
  } else {
    baseHeaders["Accept-Language"] =
      options?.lang ?? getClientSideCookie("NEXT_LOCALE") ?? "vi"
  }

  const baseUrl = options?.baseUrl ?? process.env.NEXT_PUBLIC_API_ENDPOINT

  const searchParams = options?.searchParams
    ? `?${new URLSearchParams(options.searchParams).toString()}`
    : ""

  const res = await fetch(`${baseUrl}${url}${searchParams}`, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  })

  // Nếu responseType là "blob", trả về dữ liệu dưới dạng Blob
  if (options?.responseType === "blob") {
    if (!res.ok) {
      throw new Error(`Failed to fetch blob: ${res.status} ${res.statusText}`)
    }
    return (await res.blob()) as unknown as TData
  }

  // Mặc định xử lý JSON
  const payload = (await res.json()) as OkResponse<TData>

  if (!res.ok || !payload.resultCode.includes("Success")) {
    if (res.ok) {
      throw new HttpError({
        type: payload.resultCode.includes("Fail") ? "error" : "warning",
        message: payload.message,
        resultCode: payload.resultCode,
      })
    }

    if (res.status === 422) {
      throw new HttpError({
        type: "form",
        // @ts-ignore
        fieldErrors: payload.Extensions || {},
        resultCode: "",
      })
    }

    throw new HttpError({
      type: "unknown",
      resultCode: "",
    })
  }

  return payload.data
}

export const httpBlob = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body">
  ): Promise<Response> {
    return request<Response>("GET", url, options)
  },
}
