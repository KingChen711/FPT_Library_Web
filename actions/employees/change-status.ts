//changePassword
"use server"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function changeEmployeeStatus(
  employeeId: string
): Promise<ActionResponse<string>> {
  try {
    const { message } = await http.patch(
      `/api/employees/${employeeId}/status`,
      {}
    )

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
