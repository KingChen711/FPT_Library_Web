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
  console.log(body)

  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW4ifQ.a-i4U3sbGBJg1m2ZLi-4V9kntMhLM5TBF6z9Nbgtjfw"

  await new Promise((resolve) => setTimeout(resolve, 3000))

  const cookieStore = cookies()
  cookieStore.set("accessToken", accessToken)

  return {
    isSuccess: true,
    data: {
      accessToken: accessToken,
    },
  }
}
