"use server"

import { revalidatePath } from "next/cache"
import { ServerUrl } from "@/constants"
import { auth } from "@/queries/auth"
import axios from "axios"
import { getLocale } from "next-intl/server"

import { handleHttpError } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function importLibraryItems(
  formData: FormData
): Promise<ActionResponse<{ message: string; data: string }>> {
  const { getAccessToken } = auth()
  const locale = await getLocale()
  try {
    const res = await axios.post<{
      resultCode: string
      data: string | unknown[]
      message: string
    }>(`${ServerUrl}/api/management/library-items/import`, formData, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "multipart/form-data",
        "Accept-Language": locale,
      },
    })

    if (
      res.data.resultCode === "SYS.Fail0008" &&
      Array.isArray(res.data.data)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return res.data.data as any
    }

    revalidatePath("/management/books")

    return {
      isSuccess: true,
      data: {
        message: res.data.message,
        data: res.data.data as string,
      },
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
