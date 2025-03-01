"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateLibraryPackageSchema } from "@/lib/validations/library-packages/mutate-library-package"

export async function createLibraryPackage(
  body: TMutateLibraryPackageSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.post("/api/management/packages", body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    revalidatePath("/management/packages")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
