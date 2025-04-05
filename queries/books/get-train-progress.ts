import "server-only"

import { http } from "@/lib/http"

import { auth } from "../auth"

export type TrainProgress = {
  trainingSessionId: number
  model: number
  totalTrainedItem: number
  totalTrainedTime: null
  trainingStatus: 0
  errorMessage: null
  trainingPercentage: number
  trainDate: Date
  trainBy: string
  trainingDetails: [
    {
      trainingDetailId: 1
      trainingSessionId: 1
      libraryItemId: 5
      libraryItem: null
      trainingImages: {
        trainingImageId: number
        trainingDetailId: number
        imageUrl: string
      }[]
    },
  ]
}

export async function getTrainProgress(): Promise<TrainProgress | null> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TrainProgress | null>(
      `/api/library-items/train-status`,
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
