"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { type ActionResponse } from "@/lib/types/action-response"

export async function signOut(): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const cookieStore = cookies()
  cookieStore.delete("accessToken")

  revalidateTag("who-am-i")

  return {
    isSuccess: true,
  }
}
