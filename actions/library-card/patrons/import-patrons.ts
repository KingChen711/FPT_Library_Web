"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function importPatrons(
  formData: FormData
): Promise<ActionResponse<{ message: string; data: string }>> {
  const { getAccessToken } = auth()

  try {
    const { data, message } = await http.post<string | unknown[]>(
      `/api/management/library-card-holders/import`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/library-card-holders")

    return {
      isSuccess: true,
      data: {
        message: message,
        data: data as string,
      },
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
