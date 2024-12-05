import React from "react"
import { BookOpen } from "lucide-react"

const ContributionCard = () => {
  return (
    <div className="flex h-full w-1/6 flex-col justify-between rounded-lg bg-purple-400 p-4 text-white shadow-lg">
      <div className="flex">
        <div className="rounded-lg bg-white p-2">
          <BookOpen className="size-12 text-purple-400" />
        </div>
        <div className="flex h-full flex-1 items-center justify-center text-4xl">
          10
        </div>
      </div>
      <p className="text-xl">Contribution</p>
    </div>
  )
}

export default ContributionCard
