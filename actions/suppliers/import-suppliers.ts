"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function importSuppliers(
  formData: FormData
): Promise<ActionResponse<{ message: string; data: string }>> {
  const { getAccessToken } = auth()

  try {
    const { data, resultCode, message } = await http.post<string | unknown[]>(
      `/api/management/suppliers/import`,
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

    revalidatePath("/management/suppliers")

    return {
      isSuccess: true,
      data: {
        message: message,
        data: data as string,
      },
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
