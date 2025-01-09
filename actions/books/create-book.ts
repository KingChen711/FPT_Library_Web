"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateBookSchema } from "@/lib/validations/books/mutate-book"

export type TCreateBookRes = {
  bookCodeForAITraining: string
  editionImages: string[]
}

export async function createBook(
  body: TMutateBookSchema
): Promise<ActionResponse<{ message: string } & TCreateBookRes>> {
  const { getAccessToken } = auth()
  try {
    const { message, data } = await http.post<TCreateBookRes>(
      "/api/management/books",
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/books")

    return {
      isSuccess: true,
      data: { ...data, message },
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
