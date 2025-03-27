"use client"

import React from "react"
import { X } from "lucide-react"

import { Progress } from "@/components/ui/progress"

import { useTrainAI } from "./train-ai-progress-provider"

function TrainAIToast() {
  const { trainingGroup, setTrainingGroup } = useTrainAI()

  if (!trainingGroup) return null

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:right-0 sm:flex-col md:max-w-[420px]">
      <div className="pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border bg-background p-4 pr-6 text-foreground shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full">
        <div className="grid w-full gap-2">
          <div className="flex w-full items-center gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between gap-4 text-sm">
                <span className="font-bold">{trainingGroup.groupCode}</span>
                <span>{trainingGroup.progress.toFixed(0)}%</span>
              </div>
              <Progress
                skeletonEffect
                value={trainingGroup.progress}
                className="h-2"
              />
            </div>
            <X
              onClick={() => setTrainingGroup(null)}
              className="size-4 cursor-pointer hover:text-primary"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainAIToast
