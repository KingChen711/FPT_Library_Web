"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { ERoleTypeToIndex } from "@/lib/types/enums"
import { type TMutateRoleSchema } from "@/lib/validations/roles/mutate-role"

export async function createRole(
  body: TMutateRoleSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.post(
      "/api/management/roles",
      {
        ...body,
        roleTypeIdx: ERoleTypeToIndex.get(body.roleTypeIdx),
      },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/roles")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
