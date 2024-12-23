"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError } from "@/lib/http"
import { httpBlob } from "@/lib/http-blob"
import { type ActionResponse } from "@/lib/types/action-response"

export async function exportAuthor(
  searchParams: string
): Promise<ActionResponse<Blob>> {
  const { getAccessToken } = auth()

  try {
    const res = await httpBlob.get<Blob>(
      `/api/management/authors/export?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        responseType: "blob",
      }
    )
    const url = URL.createObjectURL(res)
    const a = document.createElement("a")
    a.href = url
    a.download = "authors.xlsx"
    a.click()
    URL.revokeObjectURL(url)
    revalidateTag("authors")

    return {
      isSuccess: true,
      data: res,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
