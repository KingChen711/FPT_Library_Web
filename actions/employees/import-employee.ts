"use server"

import { revalidateTag } from "next/cache"
import { ServerUrl } from "@/constants"
import { auth } from "@/queries/auth"
import axios from "axios"

import { handleHttpError } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type ImportError } from "@/lib/types/models"

export async function importEmployee(
  formData: FormData
): Promise<ActionResponse<string | ImportError[]>> {
  const { getAccessToken } = auth()
  try {
    const res = await axios.post(
      `${ServerUrl}/api/management/employees/import`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )

    if (
      res.data.resultCode === "SYS.Fail0008" &&
      Array.isArray(res.data.data)
    ) {
      return res.data.data
    }

    revalidateTag("employees")

    return {
      isSuccess: true,
      data: res.data.message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
