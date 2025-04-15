import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type Category,
  type Condition,
  type ConditionHistory,
  type LibraryItemGroup,
  type LibraryItemInstance,
  type LibraryItemInventory,
  type Shelf,
} from "@/lib/types/models"

import { auth } from "../auth"

export type BookDetail = BookEdition & {
  category: Category
  shelf: Shelf | null
  libraryItemGroup: LibraryItemGroup | null
  libraryItemInventory: LibraryItemInventory
  resources: []
  authors: Author[]
  libraryItemInstances: (LibraryItemInstance & {
    libraryItemConditionHistories: (ConditionHistory & {
      condition: Condition
    })[]
  })[]
  aiTrainingSession?: {
    trainingSessionId: number
  }
}

const getBook = async (id: number): Promise<BookDetail | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<BookDetail>(
      `/api/management/library-items/${id}`,
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

export default getBook
