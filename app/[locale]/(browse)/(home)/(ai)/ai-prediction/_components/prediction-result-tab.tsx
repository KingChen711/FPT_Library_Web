"use client"

import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import { usePrediction } from "@/stores/ai/use-prediction"
import { Loader2, MapPin } from "lucide-react"

import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import LibraryItemInfo from "@/components/ui/library-item-info"
import { Separator } from "@/components/ui/separator"

const PredictionResultTab = () => {
  const router = useRouter()
  const { uploadedImage, bestMatchedLibraryItemId, predictResult } =
    usePrediction()
  console.log({ uploadedImage, bestMatchedLibraryItemId, predictResult })

  const { data: libraryItem, isLoading } = useLibraryItemDetail(
    bestMatchedLibraryItemId?.toString() || ""
  )

  if (isLoading) {
    return <Loader2 className="animate-spin" />
  }

  if (
    !predictResult ||
    !bestMatchedLibraryItemId ||
    !uploadedImage ||
    !libraryItem
  ) {
    router.push("/ai-prediction")
    return
  }

  return (
    <Card className="flex w-full gap-4 rounded-lg border-2 p-4">
      <section className="w-1/5">
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="flex justify-center">
            <Image
              src={libraryItem?.coverImage || ""}
              alt={libraryItem?.title}
              width={300}
              height={400}
            />
          </div>
          <Button className="flex w-full items-center gap-2">
            <MapPin size={24} /> Locate
          </Button>
        </div>
      </section>

      <section className="flex h-[60vh] flex-1 flex-col justify-between overflow-y-auto rounded-lg bg-card p-4">
        <LibraryItemInfo
          id={libraryItem?.libraryItemId.toString()}
          showInstances={true}
          shownInventory={true}
          showResources={false}
        />
      </section>

      <section className="w-1/4 space-y-4 rounded-lg border p-4 shadow-lg">
        <h1 className="text-center text-2xl font-semibold text-primary">
          AI-detected
        </h1>

        {predictResult &&
          predictResult.bestItem?.ocrResult.fieldPointsWithThreshole.map(
            (item) => (
              <div key={item?.name} className="flex items-center gap-2">
                <div className="w-1/4 font-semibold">{item?.name}:</div>
                <div className="w-1/4 text-center">{item?.matchedPoint}%</div>
                <div className="flex-1">
                  <Badge
                    variant={item?.isPassed ? "success" : "danger"}
                    className="flex w-full items-center justify-center text-center"
                  >
                    {item?.isPassed ? "Passed" : "Not passed"}
                  </Badge>
                </div>
              </div>
            )
          )}

        <Separator className="h-1" />

        {predictResult && (
          <div className="space-y-2">
            <div className="flex">
              <div className="flex-1">Threshold value:</div>
              <div className="flex-1 text-center font-semibold text-danger">
                {predictResult.bestItem?.ocrResult.confidenceThreshold}%
              </div>
            </div>
            <div className="flex">
              <div className="flex-1">Match overall:</div>
              <div className="flex-1 text-center font-semibold text-danger">
                {predictResult.bestItem?.ocrResult.totalPoint} %
              </div>
            </div>
            <div className="flex">
              <div className="flex-1">Status:</div>
              <div className="flex-1">
                <Badge
                  variant={
                    predictResult.bestItem?.ocrResult.totalPoint >=
                    predictResult.bestItem?.ocrResult.confidenceThreshold
                      ? "success"
                      : "danger"
                  }
                  className="flex w-full flex-nowrap items-center justify-center text-nowrap text-center"
                >
                  {predictResult.bestItem?.ocrResult.totalPoint >=
                  predictResult.bestItem?.ocrResult.confidenceThreshold
                    ? "Passed"
                    : "Not passed"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </section>
    </Card>
  )
}

export default PredictionResultTab
