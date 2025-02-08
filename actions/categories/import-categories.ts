"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function importCategories(
  formData: FormData
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { data, message, resultCode } = await http.post(
      `/api/management/categories/import`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    if (resultCode === "SYS.Fail0008" && Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data as any
    }

    revalidatePath("/management/categories")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
