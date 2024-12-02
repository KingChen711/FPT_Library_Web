import { type ServerActionError } from "./types/action-response"

/* eslint-disable @typescript-eslint/no-explicit-any */
type CustomOptions = RequestInit & {
  baseUrl?: string
}

type ErrorResponse = {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  extension: Record<string, string[]>
}

class HttpError extends Error {
  status: number
  message: string
  fieldErrors: Record<string, string[]>
  constructor(payload: ErrorResponse) {
    super("Http Error")
    this.status = payload.status
    this.message = payload.detail
    this.fieldErrors = payload.extension || {}
  }
}

export function handleHttpError(error: unknown): ServerActionError {
  if (!(error instanceof HttpError)) {
    return {
      isSuccess: false,
      typeError: "unknown",
    }
  }

  if (Object.keys(error.fieldErrors).length === 0) {
    return {
      typeError: "form",
      fieldErrors: error.fieldErrors,
      isSuccess: false,
    }
  }

  if (error.message) {
    return { isSuccess: false, typeError: "base", messageError: error.message }
  }

  return {
    isSuccess: false,
    typeError: "unknown",
  }
}

const request = async <ResponseData = undefined>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options?: CustomOptions
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined
  const baseHeaders = {
    "Content-Type": "application/json",
  }
  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  })

  const payload = await res.json()

  if (!res.ok) {
    throw new HttpError(payload as ErrorResponse)
  }

  return payload.data as ResponseData
}

export const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>("GET", url, options)
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body">
  ) {
    return request<Response>("POST", url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
    return request<Response>("PUT", url, { ...options, body })
  },
  patch<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body">
  ) {
    return request<Response>("PATCH", url, { ...options, body })
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>("DELETE", url, options)
  },
}
