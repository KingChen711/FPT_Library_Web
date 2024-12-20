"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TEmployeeDialogSchema } from "@/lib/validations/employee/employee-dialog"

export async function createEmployee(
  body: TEmployeeDialogSchema
): Promise<ActionResponse> {
  const { getAccessToken } = auth()

  try {
    await http.post("/api/management/employees", body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    revalidateTag("employees")

    return {
      isSuccess: true,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
