"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function updateEmployeeRole(
  employeeId: string,
  roleId: number
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.patch(
      `/api/management/roles/employees/${employeeId}?roleId=${roleId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidateTag("employees")
    revalidatePath("/management/employees")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
