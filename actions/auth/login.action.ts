"use server"

import { cookies } from "next/headers"

import { type ActionResponse } from "@/lib/types/action-response"
import { type TLoginSchema } from "@/lib/validations/auth/login"

type LoginActionData = {
  accessToken: string
}

export async function login(
  body: TLoginSchema
): Promise<ActionResponse<TLoginSchema, LoginActionData>> {
  const accessToken = `access token of ${body.email}`

  await new Promise((resolve) => setTimeout(resolve, 3000))

  const cookieStore = await cookies()
  cookieStore.set("accessToken", accessToken)

  return {
    isSuccess: true,
    data: {
      accessToken: accessToken,
    },
  }
}
