import React from "react"

import { type DetectedValue } from "@/lib/types/models"
import { cn } from "@/lib/utils"

import { Label } from "./label"
import { Progress } from "./progress"

type Props = {
  detectValues: DetectedValue[]
}

const PredictionOcrDetectStatistic = ({ detectValues }: Props) => {
  return (
    <section className="flex flex-1 flex-col gap-2">
      {/* Example list content */}
      <h1 className="mt-2 text-center text-xl font-semibold text-primary">
        Statistic
      </h1>
      {detectValues?.map((value, index) => (
        <div key={index} className="flex items-center justify-between gap-2">
          <Label className="w-1/3 text-nowrap text-sm font-semibold">
            {value.name}
          </Label>
          <Progress
            value={value.percentage}
            className={cn("flex-1 bg-muted", {
              "[&>div]:bg-success": value.percentage >= 80,
              "[&>div]:bg-danger": value.percentage <= 30,
            })}
          />
          <p
            className={cn("text-sm font-semibold", {
              "text-success": value.percentage >= 80,
              "text-danger": value.percentage <= 30,
            })}
          >
            {value.percentage.toFixed(2)}%
          </p>
        </div>
      ))}
    </section>
  )
}

export default PredictionOcrDetectStatistic
