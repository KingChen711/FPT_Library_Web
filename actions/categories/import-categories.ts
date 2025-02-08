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
    const { message } = await http.post(
      `/api/management/categories/import`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/categories")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    const resError = handleHttpError(error)

    if (
      resError.typeError === "error" &&
      resError.resultCode === "SYS.Fail0008"
    ) {
      return resError.data
    }

    return resError
  }
}
