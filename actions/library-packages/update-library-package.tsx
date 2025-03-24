"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateLibraryPackageSchema } from "@/lib/validations/library-packages/mutate-library-package"

export async function updateLibraryPackage(
  libraryCardPackageId: number,
  body: TMutateLibraryPackageSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.put(
      `/api/management/packages/${libraryCardPackageId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/packages")
    revalidateTag("packages")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
