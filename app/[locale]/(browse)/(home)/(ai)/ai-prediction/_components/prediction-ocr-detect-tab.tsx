"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import { usePrediction } from "@/stores/ai/use-prediction"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import useOcrDetect from "@/hooks/ai/use-ocr-detect"
import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import { Card } from "@/components/ui/card"
import LibraryItemInfo from "@/components/ui/library-item-info"
import PredictionOcrDetectStatistic from "@/components/ui/prediction-ocr-detect-statistic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

enum EOcrDetectTab {
  UPLOADED_BOOK = "uploaded-book",
  DETECTED_BOOK = "detected-book",
  BOTH_BOOKS = "both-books",
}

const PredictionOcrDetectTab = () => {
  const t = useTranslations("AI")
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState<EOcrDetectTab>(
    EOcrDetectTab.BOTH_BOOKS
  )
  const { uploadedImage, bestMatchedLibraryItemId, predictResult } =
    usePrediction()

  const { data: ocrDetect, isLoading } = useOcrDetect(
    bestMatchedLibraryItemId?.toString() as string,
    uploadedImage!
  )

  const { data: libraryItem, isLoading: isLoadingLibraryItem } =
    useLibraryItemDetail(bestMatchedLibraryItemId?.toString() || "")

  if (isLoading || isLoadingLibraryItem || !ocrDetect) {
    return <Loader2 className="animate-spin" />
  }

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
        <TabsTrigger value={EOcrDetectTab.BOTH_BOOKS}>
          {t("both books")}
        </TabsTrigger>
        <TabsTrigger value={EOcrDetectTab.UPLOADED_BOOK}>
          {t("uploaded book")}
        </TabsTrigger>
        <TabsTrigger value={EOcrDetectTab.DETECTED_BOOK}>
          {t("detected book")}
        </TabsTrigger>
      </TabsList>
      {/* Both books */}
      <TabsContent value={EOcrDetectTab.BOTH_BOOKS}>
        <Card>
          <div className="flex w-full items-center justify-evenly gap-24 p-4">
            <div className="flex flex-col gap-2">
              <Image
                src={URL.createObjectURL(uploadedImage)}
                alt={"Uploaded Book"}
                width={200}
                height={300}
                className="overflow-hidden rounded-md object-cover shadow-lg"
              />
              <h1 className="text-center font-semibold">
                {t("uploaded book")}
              </h1>
            </div>

            <div className="flex flex-col gap-2">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Image
                      src={libraryItem?.coverImage as string}
                      alt={t("detected book")}
                      width={200}
                      height={300}
                      className="overflow-hidden rounded-md object-cover shadow-lg"
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    align="start"
                    side="left"
                    className="max-h-[60vh] overflow-y-auto border-2 bg-card"
                  >
                    <LibraryItemInfo
                      id={libraryItem?.libraryItemId?.toString() as string}
                      showInstances={false}
                      showResources={false}
                      shownInventory={true}
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <h1 className="text-center font-semibold">
                {t("detected book")}
              </h1>
            </div>
          </div>

          <div className="flex w-full items-center justify-evenly gap-24 p-4">
            <PredictionOcrDetectStatistic
              detectValues={ocrDetect?.importImageDetected as []}
            />
            <PredictionOcrDetectStatistic
              detectValues={ocrDetect?.currentItemDetected as []}
            />
          </div>
        </Card>
      </TabsContent>
      {/* Uploaded book */}
      <TabsContent value={EOcrDetectTab.UPLOADED_BOOK}>
        <Card className="flex w-full items-start justify-between gap-4 p-4">
          <div className="w-3/5">
            <PredictionOcrDetectStatistic
              detectValues={ocrDetect?.importImageDetected as []}
            />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <Image
              src={URL.createObjectURL(uploadedImage)}
              alt={"Uploaded Book"}
              width={200}
              height={300}
              className="rounded-md object-contain shadow-lg"
            />
            <h1 className="text-center font-semibold">{t("uploaded book")}</h1>
          </div>
        </Card>
      </TabsContent>

      {/* Detected book */}
      <TabsContent value={EOcrDetectTab.DETECTED_BOOK}>
        <Card className="flex w-full items-start justify-between gap-4 p-4">
          <div className="w-3/5">
            <PredictionOcrDetectStatistic
              detectValues={ocrDetect?.currentItemDetected as []}
            />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image
                    src={libraryItem?.coverImage as string}
                    alt={"Detected Book"}
                    width={200}
                    height={300}
                    className="overflow-hidden rounded-md object-cover shadow-lg"
                  />
                </TooltipTrigger>
                <TooltipContent
                  align="start"
                  side="left"
                  className="max-h-[60vh] overflow-y-auto border-2 bg-card"
                >
                  <LibraryItemInfo
                    id={libraryItem?.libraryItemId?.toString() as string}
                    showInstances={false}
                    showResources={false}
                    shownInventory={true}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h1 className="text-center font-semibold">{t("detected book")}</h1>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default PredictionOcrDetectTab
