"use server"

import { cookies } from "next/headers"

import { handleHttpError } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function logout(): Promise<ActionResponse> {
  try {
    const cookiesStore = cookies()
    cookiesStore.delete("accessToken")
    cookiesStore.delete("accessToken")

    return { isSuccess: true }
  } catch (error) {
    return handleHttpError(error)
  }
}
