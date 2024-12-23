"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function importEmployee(
  formData: FormData
): Promise<ActionResponse> {
  console.log("🚀 ~ formData:", formData)
  const { getAccessToken } = auth()
  try {
    const res = await http.post(`/api/management/employees/import`, formData, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    console.log("🚀 ~ res:", res)
    revalidateTag("employees")

    return {
      isSuccess: true,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
