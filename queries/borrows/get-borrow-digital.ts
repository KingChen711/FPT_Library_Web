/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import {
  type BookResource,
  type BorrowDigital,
  type LibraryCard,
} from "@/lib/types/models"

import { auth } from "../auth"

export type BorrowDigitalDetailItem = BorrowDigital & {
  libraryResource: BookResource
  librarycard: LibraryCard
}

const getBorrowDigital = async (
  borrowDigitalId: number
): Promise<BorrowDigitalDetailItem | null> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<BorrowDigitalDetailItem>(
      `/api/management/borrows/digital/${borrowDigitalId}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data || null
  } catch {
    return null
  }
}

export default getBorrowDigital
