"use server"

import { revalidatePath } from "next/cache"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { ERoleTypeToIndex } from "@/lib/types/enums"
import { type TMutateRoleSchema } from "@/lib/validations/roles/mutate-role"

export async function createRole(
  body: TMutateRoleSchema
): Promise<ActionResponse<string>> {
  try {
    const { message } = await http.post("/api/roles", {
      ...body,
      roleTypeIdx: ERoleTypeToIndex.get(body.roleTypeIdx),
    })

    revalidatePath("/management/roles")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
