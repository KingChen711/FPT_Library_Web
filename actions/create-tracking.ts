"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function createTracking(
  formData: FormData
): Promise<
  ActionResponse<{ message: string; data: string; resultCode: string }>
> {
  const { getAccessToken } = auth()

  try {
    const { data, message, resultCode } = await http.post<string | unknown[]>(
      `/api/management/warehouse-trackings`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/trackings")

    return {
      isSuccess: true,
      data: {
        resultCode,
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
