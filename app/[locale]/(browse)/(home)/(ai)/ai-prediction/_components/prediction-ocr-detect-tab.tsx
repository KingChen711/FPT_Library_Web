"use client"

import React, { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import TooltipItemContent from "@/components/ui/tooltip-item-content"

import { dummyBooks } from "../../../_components/dummy-books"

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

enum EOcrDetectTab {
  UPLOADED_BOOK = "uploaded-book",
  DETECTED_BOOK = "detected-book",
  BOTH_BOOKS = "both-books",
}

const PredictionOcrDetectTab = () => {
  const uploadedBook = dummyBooks[0]
  const detectedBook = dummyBooks[1]

  const [currentTab, setCurrentTab] = useState<EOcrDetectTab>(
    EOcrDetectTab.BOTH_BOOKS
  )

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault() // Prevent default browser tabbing behavior

      // Define the tab order
      const tabOrder = [
        EOcrDetectTab.UPLOADED_BOOK,
        EOcrDetectTab.DETECTED_BOOK,
        EOcrDetectTab.BOTH_BOOKS,
      ]

      // Find the index of the current tab and calculate the next one
      const currentIndex = tabOrder.indexOf(currentTab)
      const nextIndex = (currentIndex + 1) % tabOrder.length

      setCurrentTab(tabOrder[nextIndex]) // Update the current tab
    }
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <Card className="flex w-full gap-8 rounded-lg border-2 p-4">
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

        <section className="flex-1">
          <Tabs
            value={currentTab}
            onValueChange={(value) => setCurrentTab(value as EOcrDetectTab)}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value={EOcrDetectTab.BOTH_BOOKS}>
                Both Books
              </TabsTrigger>
              <TabsTrigger value={EOcrDetectTab.UPLOADED_BOOK}>
                Uploaded book
              </TabsTrigger>
              <TabsTrigger value={EOcrDetectTab.DETECTED_BOOK}>
                Detected book
              </TabsTrigger>
            </TabsList>
            {/* Both books */}
            <TabsContent value={EOcrDetectTab.BOTH_BOOKS}>
              <Card className="flex w-full items-center justify-evenly gap-8 p-4">
                <div className="flex flex-col gap-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Image
                          src={uploadedBook.image}
                          alt={uploadedBook.title}
                          width={200}
                          height={300}
                          className="overflow-hidden rounded-lg object-cover shadow-lg"
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        align="start"
                        side="left"
                        className="border-2 bg-card"
                      >
                        <TooltipItemContent id={uploadedBook.id.toString()} />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <h1 className="text-center font-semibold">Uploaded Book</h1>
                </div>

                <div className="flex flex-col gap-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Image
                          src={detectedBook.image}
                          alt={detectedBook.title}
                          width={200}
                          height={300}
                          className="overflow-hidden rounded-lg object-cover shadow-lg"
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        align="start"
                        side="left"
                        className="border-2 bg-card"
                      >
                        <TooltipItemContent id={detectedBook.id.toString()} />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <h1 className="text-center font-semibold">Detected Book</h1>
                </div>
              </Card>
            </TabsContent>
            {/* Uploaded book */}
            <TabsContent value={EOcrDetectTab.UPLOADED_BOOK}>
              <Card className="flex w-full items-center justify-center gap-4 p-4">
                <div className="flex flex-col gap-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Image
                          src={uploadedBook.image}
                          alt={uploadedBook.title}
                          width={200}
                          height={300}
                          className="rounded-lg object-contain shadow-lg"
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        align="start"
                        side="left"
                        className="border-2 bg-card"
                      >
                        <TooltipItemContent id={uploadedBook.id.toString()} />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <h1 className="text-center font-semibold">Uploaded Book</h1>
                </div>
              </Card>
            </TabsContent>

            {/* Detected book */}
            <TabsContent value={EOcrDetectTab.DETECTED_BOOK}>
              <Card className="flex w-full items-center justify-center gap-4 p-4">
                <div className="flex flex-col gap-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Image
                          src={detectedBook.image}
                          alt={detectedBook.title}
                          width={200}
                          height={300}
                          className="rounded-lg object-contain shadow-lg"
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        align="start"
                        side="left"
                        className="border-2 bg-card"
                      >
                        <TooltipItemContent id={detectedBook.id.toString()} />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <h1 className="text-center font-semibold">Detected Book</h1>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </Card>
    </div>
  )
}

export default PredictionOcrDetectTab
