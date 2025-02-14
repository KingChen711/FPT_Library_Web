import { create } from "zustand"

import { type PredictResult } from "@/lib/types/models"

type TPrediction = {
  uploadedImage: File | null
  setUploadImage: (image: File) => void
  detectedLibraryItemIds: number[]
  setDetectedLibraryItemIds: (ids: number[]) => void
  bestMatchedLibraryItemId: number | null
  setBestMatchedLibraryItemId: (id: number) => void
  predictResult: PredictResult | null
  setPredictResult: (result: PredictResult) => void
}

export const usePrediction = create<TPrediction>((set) => ({
  uploadedImage: null,
  setUploadImage: (image: File) => set({ uploadedImage: image }),

  detectedLibraryItemIds: [],
  setDetectedLibraryItemIds: (ids: number[]) =>
    set({ detectedLibraryItemIds: ids }),

  bestMatchedLibraryItemId: null,
  setBestMatchedLibraryItemId: (id: number) =>
    set({ bestMatchedLibraryItemId: id }),

  predictResult: null,
  setPredictResult: (result: PredictResult) => set({ predictResult: result }),
}))
