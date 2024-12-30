"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateEmployeeSchema } from "@/lib/validations/employee/mutate-employee"

export async function createEmployee(
  body: TMutateEmployeeSchema
): Promise<ActionResponse> {
  const { getAccessToken } = auth()

  try {
    await http.post(
      "/api/management/employees",
      {
        ...body,
        gender: body.gender === "Male" ? 0 : 1,
        roleId: Number(body.roleId),
      },
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
