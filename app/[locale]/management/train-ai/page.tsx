import React from "react"
import { auth } from "@/queries/auth"
import { getTrainProgress } from "@/queries/books/get-train-progress"
import { getUntrainedGroups } from "@/queries/books/get-untrained-group"

import { EFeature } from "@/lib/types/enums"

import TrainAIForm from "./train-ai-form"

async function BooksManagementPage() {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const groups = await getUntrainedGroups()
  const trainProgress = await getTrainProgress()

  console.log({
    trainProgress,
    trainingPercentage: trainProgress?.trainingPercentage,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">Train AI</h3>
      </div>

      <TrainAIForm trainProgress={trainProgress} groups={groups} />
    </div>
  )
}

export default BooksManagementPage
