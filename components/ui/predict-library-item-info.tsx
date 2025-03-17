"use client"

import Image from "next/image"
import { Loader2, MapPin } from "lucide-react"

import { type OcrResult } from "@/lib/types/models"
import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import LibraryItemInfo from "./library-item-info"

type Props = {
  libraryItemId: string
  ocrResult: OcrResult
}

const PredictLibraryItemInfo = ({ libraryItemId, ocrResult }: Props) => {
  const { data: libraryItem, isLoading } = useLibraryItemDetail(libraryItemId)

  if (isLoading) {
    return <Loader2 className="animate-spin" />
  }

  return (
    <div className="flex size-full items-stretch gap-4">
      <div className="flex flex-1 items-start justify-between gap-4 p-4">
        <section className="flex h-full w-1/4 flex-col gap-2">
          <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg">
            <AspectRatio ratio={3 / 4}>
              <Image
                src={libraryItem?.coverImage || ""}
                alt={"Selected Book"}
                width={300}
                height={400}
                className="rounded-md object-cover"
              />
            </AspectRatio>
          </div>

          <Button className="flex w-full items-center gap-2">
            <MapPin size={24} /> Locate
          </Button>
        </section>

        <section className="flex h-full flex-1 flex-col justify-between overflow-y-auto rounded-lg px-4">
          <LibraryItemInfo
            id={libraryItemId}
            shownInventory={true}
            showInstances={true}
            showResources={true}
          />
        </section>
      </div>

      <section className="w-1/4 space-y-2 rounded-lg border p-4 shadow-lg">
        <h1 className="text-center text-2xl font-semibold text-primary">
          AI-detected
        </h1>
        {ocrResult?.fieldPointsWithThreshole?.map((field) => (
          <div key={field.name} className="flex items-center gap-2">
            <div className="w-1/4 font-semibold capitalize">{field.name}:</div>
            <div className="w-1/4 text-center">{field.matchedPoint}%</div>
            <div className="flex-1">
              <Badge
                variant={field.isPassed ? "success" : "danger"}
                className="flex w-full items-center justify-center text-center"
              >
                {field.isPassed ? "Passed" : "Not passed"}
              </Badge>
            </div>
          </div>
        ))}

        <Separator className="h-1" />

        <div className="space-y-2">
          <div className="flex">
            <div className="flex-1">Threshold value:</div>
            <div className="flex-1 text-center font-semibold text-danger">
              {ocrResult?.confidenceThreshold}%
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">Match overall:</div>
            <div className="flex-1 text-center font-semibold text-danger">
              {ocrResult?.totalPoint}%
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">Status:</div>
            <div className="flex-1">
              <Badge
                variant={
                  ocrResult?.totalPoint > ocrResult?.confidenceThreshold
                    ? "success"
                    : "danger"
                }
                className="flex w-full flex-nowrap items-center justify-center text-nowrap text-center"
              >
                {ocrResult?.totalPoint > ocrResult?.confidenceThreshold
                  ? "Passed"
                  : "Not passed"}
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PredictLibraryItemInfo
