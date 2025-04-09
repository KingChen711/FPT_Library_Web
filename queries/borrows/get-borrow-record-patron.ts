/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type BorrowRecord,
  type BorrowRecordDetail,
  type BorrowRequestManagement,
  type Category,
  type Condition,
  type Employee,
  type Fine,
  type FineBorrow,
  type LibraryCard,
  type LibraryItemInstance,
  type Shelf,
} from "@/lib/types/models"

import { auth } from "../auth"

export type BorrowRecordDetailItem = BorrowRecord & {
  borrowRequest: BorrowRequestManagement
  processedByNavigation: Employee
  librarycard: LibraryCard
  borrowRecordDetails: (BorrowRecordDetail & {
    libraryItem: BookEdition & {
      shelf: Shelf | null
      category: Category
      authors: Author[]
      libraryItemInstances: LibraryItemInstance[]
    }
    condition: Condition
    returnCondition: Condition | null
    fines: (FineBorrow & { finePolicy: Fine; createByNavigation: Employee })[]
  })[]
}

const getBorrowRecordPatron = async (
  borrowRecordId: number
): Promise<BorrowRecordDetailItem | null> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<BorrowRecordDetailItem>(
      `/api/users/borrows/records/${borrowRecordId}`,
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

export default getBorrowRecordPatron
