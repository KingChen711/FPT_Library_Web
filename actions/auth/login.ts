"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TLoginSchema } from "@/lib/validations/auth/login"

type LoginActionData = {
  accessToken: string
  refreshToken: string
}

export async function login(
  body: TLoginSchema
): Promise<ActionResponse<LoginActionData>> {
  // console.log(body)

  // const accessToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW4ifQ.a-i4U3sbGBJg1m2ZLi-4V9kntMhLM5TBF6z9Nbgtjfw"
  // const refreshToken = "this-is-refreshToken"

  // await new Promise((resolve) => setTimeout(resolve, 3000))

  try {
    const data = await http.post<LoginActionData>("/api/auth/sign-in", body)
    const cookieStore = cookies()
    cookieStore.set("accessToken", data.accessToken)
    cookieStore.set("refreshToken", data.refreshToken)

    revalidateTag("who-am-i")

    return {
      isSuccess: true,
      data,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
