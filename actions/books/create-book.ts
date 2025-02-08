"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"

export async function createBook(
  body: TBookEditionSchema
): Promise<ActionResponse<{ message: string } & { bookCode: string }>> {
  const { getAccessToken } = auth()
  try {
    const { message, data } = await http.post<{ libraryItemId: number }>(
      "/api/management/library-items",
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    const { data: dataDefine } = await http.post<{ trainingCode: string }>(
      "/api/management/groups/define-group",
      { rootItemId: data.libraryItemId },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/books")

    return {
      isSuccess: true,
      data: { bookCode: dataDefine?.trainingCode || "", message },
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
