"use client"

import React from "react"
import { X } from "lucide-react"
import { useLocale } from "next-intl"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"

import { useTrainAI } from "./train-ai-progress-provider"

function TrainAIToast() {
  const { trainingGroups, setTrainingGroups } = useTrainAI()
  const locale = useLocale()

  if (trainingGroups.length === 0) return null

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:right-0 sm:flex-col md:max-w-[420px]">
      <div className="group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border bg-background p-4 pr-6 text-foreground shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full">
        <div className="grid">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="py-0">
                {locale === "vi"
                  ? "Các tiến trình train AI"
                  : "Training AI progresses"}
              </AccordionTrigger>
              <AccordionContent asChild>
                <div className="grid gap-2">
                  {trainingGroups?.map((item) => (
                    <div
                      key={item.groupCode}
                      className="flex items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4 text-sm">
                          <span>
                            {locale === "vi" ? "Mã nhóm" : "Group name"}:{" "}
                            {item.groupCode}
                          </span>
                          <span>{item.progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                      <X
                        onClick={() =>
                          setTrainingGroups((prev) =>
                            prev.filter((i) => i.groupCode !== item.groupCode)
                          )
                        }
                        className="size-4 cursor-pointer hover:text-primary"
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default TrainAIToast
