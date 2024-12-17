"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError } from "@/lib/http"
import { httpBlob } from "@/lib/http-blob"
import { type ActionResponse } from "@/lib/types/action-response"

export async function exportEmployee(
  searchParams: string
): Promise<ActionResponse<Blob>> {
  console.log("🚀🚀🚀 ~ searchParams:", searchParams)
  const { getAccessToken } = auth()

  try {
    const res = await httpBlob.get<Blob>(
      `/api/management/employees/export?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        responseType: "blob",
      }
    )
    console.log("🚀 ~ res:", res)
    const url = URL.createObjectURL(res)
    const a = document.createElement("a")
    a.href = url
    a.download = "employees.xlsx"
    a.click()
    URL.revokeObjectURL(url)
    revalidateTag("employees")

    return {
      isSuccess: true,
      data: res,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
