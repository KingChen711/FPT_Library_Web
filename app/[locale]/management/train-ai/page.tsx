import React from "react"
import { auth } from "@/queries/auth"
import { getUntrainedGroups } from "@/queries/books/get-untrained-group"

import { EFeature } from "@/lib/types/enums"

import TrainAIForm from "./train-ai-form"

async function BooksManagementPage() {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const groups = await getUntrainedGroups()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">Train AI</h3>
      </div>

      <TrainAIForm groups={groups} />
    </div>
  )
}

export default BooksManagementPage
