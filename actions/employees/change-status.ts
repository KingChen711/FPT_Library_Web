"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function changeEmployeeStatus(
  employeeId: string
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  console.log("🚀 ~ getAccessToken:", getAccessToken())
  console.log(123)
  try {
    const { message } = await http.patch(
      `/api/employees/${employeeId}/status`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidateTag("employees")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
