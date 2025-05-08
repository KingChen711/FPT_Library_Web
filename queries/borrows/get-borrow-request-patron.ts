/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import {
  type BorrowRequest,
  type BorrowRequestResource,
  type Transaction,
} from "@/lib/types/models"

import { auth } from "../auth"

type BorrowRequestDetail = BorrowRequest & {
  isExistPendingResources: boolean
  borrowRequestResources: (BorrowRequestResource & {
    transaction?: Transaction | null
  })[]
}

const getBorrowRequestPatron = async (
  borrowRequestId: number
): Promise<BorrowRequestDetail | null> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<BorrowRequestDetail | null>(
      `/api/users/borrows/requests/${borrowRequestId}`,
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

export default getBorrowRequestPatron
