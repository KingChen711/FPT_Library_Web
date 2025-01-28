"use server"

import { revalidatePath } from "next/cache"
import { ServerUrl } from "@/constants"
import { auth } from "@/queries/auth"
import axios from "axios"
import { getLocale } from "next-intl/server"

import { handleHttpError } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function importCategories(
  formData: FormData
): Promise<ActionResponse<string>> {
  console.log("importCategories")

  const { getAccessToken } = auth()
  const locale = await getLocale()
  try {
    const res = await axios.post(
      //TODO: Fix this URL on the server fixed
      `${ServerUrl}/api/management/categories/import`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "multipart/form-data",
          "Accept-Language": locale,
        },
      }
    )

    if (
      res.data.resultCode === "SYS.Fail0008" &&
      Array.isArray(res.data.data)
    ) {
      return res.data.data
    }

    revalidatePath("/management/categories")

    return {
      isSuccess: true,
      data: res.data.message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
