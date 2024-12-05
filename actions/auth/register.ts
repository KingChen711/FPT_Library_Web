"use server"

// import { revalidateTag } from "next/cache"
// import { cookies } from "next/headers"
import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TRegisterSchema } from "@/lib/validations/auth/register"

// type RegisterActionData = {
//   accessToken: string
//   refreshToken: string
// }

export async function register(body: TRegisterSchema): Promise<ActionResponse> {
  try {
    await http.post("/api/auth/sign-up", body)

    // const cookieStore = cookies()
    // cookieStore.set("accessToken", data.accessToken)
    // cookieStore.set("refreshToken", data.refreshToken)

    // revalidateTag("who-am-i")

    return {
      isSuccess: true,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
