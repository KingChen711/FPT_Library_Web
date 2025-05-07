"use server"

import { cookies } from "next/headers"

import { handleHttpError } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function changeLanguage(): Promise<ActionResponse<string>> {
  try {
    const cookiesStore = cookies()
    const locale = cookiesStore.get("NEXT_LOCALE")?.value
    const newLocale = locale === "vi" ? "en" : "vi"
    const newLanguage = locale === "vi" ? "en" : "vi"
    cookiesStore.set("NEXT_LOCALE", newLanguage)
    return { isSuccess: true, data: newLocale }
  } catch (error) {
    return handleHttpError(error)
  }
}
