/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
  type Shelf,
  type TrainDetail,
  type TrainSession,
} from "@/lib/types/models"

import { auth } from "../auth"

export type TrainSessionDetailItem = TrainSession & {
  trainingDetails: (TrainDetail & {
    trainingImages: { imageUrl: string }[]
    libraryItem: BookEdition & {
      shelf: Shelf | null
      category: Category
      libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
    }
  })[]
}

const getTrainSession = async (
  trainSessionId: number
): Promise<TrainSessionDetailItem | null> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<TrainSessionDetailItem>(
      `/api/management/sessions/${trainSessionId}`,
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

export default getTrainSession
