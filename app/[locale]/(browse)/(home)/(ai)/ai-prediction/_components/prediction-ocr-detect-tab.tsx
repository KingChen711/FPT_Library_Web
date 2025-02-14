"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import { usePrediction } from "@/stores/ai/use-prediction"
import { useTranslations } from "next-intl"

import useOcrDetect from "@/hooks/ai/use-ocr-detect"
import { Card } from "@/components/ui/card"
import PredictionOcrDetectStatistic from "@/components/ui/prediction-ocr-detect-statistic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import TooltipItemContent from "@/components/ui/tooltip-item-content"

import { dummyBooks } from "../../../_components/dummy-books"

enum EOcrDetectTab {
  UPLOADED_BOOK = "uploaded-book",
  DETECTED_BOOK = "detected-book",
  BOTH_BOOKS = "both-books",
}

const PredictionOcrDetectTab = () => {
  const t = useTranslations("BookPage")
  const router = useRouter()
  const { uploadedImage, bestMatchedLibraryItemId, predictResult } =
    usePrediction()

  const { data: ocrDetect, isLoading } = useOcrDetect(
    bestMatchedLibraryItemId?.toString() as string,
    uploadedImage!
  )

  const uploadedBook = dummyBooks[0]
  const detectedBook = dummyBooks[1]

  const [currentTab, setCurrentTab] = useState<EOcrDetectTab>(
    EOcrDetectTab.BOTH_BOOKS
  )

  if (!predictResult || !bestMatchedLibraryItemId || !uploadedImage) {
    router.push("/ai-prediction")
    return
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={(value) => setCurrentTab(value as EOcrDetectTab)}
      className="w-full"
    >
      <TabsList>
        <TabsTrigger value={EOcrDetectTab.BOTH_BOOKS}>Both Books</TabsTrigger>
        <TabsTrigger value={EOcrDetectTab.UPLOADED_BOOK}>
          Uploaded book
        </TabsTrigger>
        <TabsTrigger value={EOcrDetectTab.DETECTED_BOOK}>
          Detected book
        </TabsTrigger>
      </TabsList>
      {/* Both books */}
      <TabsContent value={EOcrDetectTab.BOTH_BOOKS}>
        <Card>
          <div className="flex w-full items-center justify-evenly gap-24 p-4">
            <div className="flex flex-col gap-2">
              <Image
                src={uploadedBook.image}
                alt={uploadedBook.title}
                width={200}
                height={300}
                className="overflow-hidden rounded-lg object-cover shadow-lg"
              />
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
          </div>

          <div className="flex w-full items-center justify-evenly gap-24 p-4">
            <PredictionOcrDetectStatistic />
            <PredictionOcrDetectStatistic />
          </div>
        </Card>
      </TabsContent>
      {/* Uploaded book */}
      <TabsContent value={EOcrDetectTab.UPLOADED_BOOK}>
        <Card className="flex w-full items-center justify-between gap-4 p-4">
          <div className="w-3/5">
            <PredictionOcrDetectStatistic />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <Image
              src={uploadedBook.image}
              alt={uploadedBook.title}
              width={200}
              height={300}
              className="rounded-lg object-contain shadow-lg"
            />
            <h1 className="text-center font-semibold">Uploaded Book</h1>
          </div>
        </Card>
      </TabsContent>

      {/* Detected book */}
      <TabsContent value={EOcrDetectTab.DETECTED_BOOK}>
        <Card className="flex w-full items-center justify-between gap-4 p-4">
          <div className="w-3/5">
            <PredictionOcrDetectStatistic />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
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
  )
}

export default PredictionOcrDetectTab
