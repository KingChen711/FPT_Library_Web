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
    // await http.post("/api/auth/sign-up", body)
    // const res = await fetch("https://127.0.0.1:5001/api/auth/sign-up", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // })
    const res = await fetch("http://127.0.0.1:5246/api/companies")

    const data = await res.json()

    console.log({ data })

    // const cookieStore = cookies()
    // cookieStore.set("accessToken", data.accessToken)
    // cookieStore.set("refreshToken", data.refreshToken)

    // revalidateTag("who-am-i")

    return {
      isSuccess: true,
    }
  } catch (error) {
    console.log({ error })

    return handleHttpError(error)
  }
}
