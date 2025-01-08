"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateEmployeeSchema } from "@/lib/validations/employee/mutate-employee"

export async function updateEmployee(
  employeeId: string,
  body: Omit<TMutateEmployeeSchema, "email" | "roleId">
): Promise<ActionResponse> {
  const { getAccessToken } = auth()

  try {
    await http.put(
      `/api/management/employees/${employeeId}`,
      { ...body, gender: body.gender === "Male" ? 0 : 1 },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidateTag("employees")

    return {
      isSuccess: true,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
