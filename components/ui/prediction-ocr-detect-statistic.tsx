import React from "react"

import { cn } from "@/lib/utils"

import { Label } from "./label"
import { Progress } from "./progress"

const objectLists = [
  {
    id: 1,
    label: "Confidence threshold",
    progressValue: 18,
  },
  {
    id: 2,
    label: "IoU threshold",
    progressValue: 45,
  },
  {
    id: 3,
    label: "Person",
    progressValue: 86,
  },
  {
    id: 4,
    label: "Chair",
    progressValue: 77,
  },
  {
    id: 5,
    label: "Table",
    progressValue: 3,
  },
  {
    id: 6,
    label: "Book",
    progressValue: 100,
  },
  {
    id: 7,
    label: "Car",
    progressValue: 78,
  },
  {
    id: 8,
    label: "Bicycle",
    progressValue: 10,
  },
  {
    id: 9,
    label: "Laptop",
    progressValue: 55,
  },
  {
    id: 10,
    label: "Monitor",
    progressValue: 65,
  },
  {
    id: 11,
    label: "Keyboard",
    progressValue: 40,
  },
  {
    id: 12,
    label: "Mouse",
    progressValue: 90,
  },
]

const PredictionOcrDetectStatistic = () => {
  return (
    <section className="flex flex-1 flex-col gap-2">
      {/* Example list content */}
      <h1 className="mt-2 text-center text-xl font-semibold text-primary">
        Statistic
      </h1>
      {objectLists.map((objectList) => (
        <div
          key={objectList.id}
          className="flex items-center justify-between gap-2"
        >
          <Label className="w-1/3 text-nowrap text-sm font-semibold">
            {objectList.label}
          </Label>
          <Progress
            value={objectList.progressValue}
            className={cn("flex-1 bg-muted", {
              "[&>div]:bg-success": objectList.progressValue >= 80,
              "[&>div]:bg-danger": objectList.progressValue <= 30,
            })}
          />
          <p
            className={cn("text-sm font-semibold", {
              "text-success": objectList.progressValue >= 80,
              "text-danger": objectList.progressValue <= 30,
            })}
          >
            {objectList.progressValue}%
          </p>
        </div>
      ))}
    </section>
  )
}

export default PredictionOcrDetectStatistic
