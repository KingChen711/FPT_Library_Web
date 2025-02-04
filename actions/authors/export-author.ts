"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function exportAuthor(
  searchParams: string
): Promise<ActionResponse<Blob>> {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<Blob>(
      `/api/management/authors/export?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        responseType: "blob",
      }
    )
    const url = URL.createObjectURL(data)
    const a = document.createElement("a")
    a.href = url
    a.download = "authors.xlsx"
    a.click()
    URL.revokeObjectURL(url)
    revalidateTag("authors")

    return {
      isSuccess: true,
      data,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
