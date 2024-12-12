"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { type ActionResponse } from "@/lib/types/action-response"

export async function signOut(): Promise<ActionResponse> {
  const cookieStore = cookies()
  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")

  revalidateTag("who-am-i")

  return {
    isSuccess: true,
  }
}
