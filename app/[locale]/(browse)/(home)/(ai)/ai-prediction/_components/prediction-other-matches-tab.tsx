"use client"

import { useRouter } from "@/i18n/routing"
import { usePrediction } from "@/stores/ai/use-prediction"
import { Search } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Paginator from "@/components/ui/paginator"
import PredictLibraryItemInfo from "@/components/ui/predict-library-item-info"

const PredictionOtherMatchesTab = () => {
  const router = useRouter()
  const { uploadedImage, bestMatchedLibraryItemId, predictResult } =
    usePrediction()

  if (!predictResult || !bestMatchedLibraryItemId || !uploadedImage) {
    router.push("/ai-prediction")
    return
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative mt-2 w-1/3">
        <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search"
          className="pl-8"
          autoComplete="off"
        />
      </div>

      {predictResult?.otherItems?.map((item) => (
        <Card
          key={item.libraryItemId}
          className="flex h-[340px] w-full gap-4 rounded-lg p-4"
        >
          <PredictLibraryItemInfo
            libraryItemId={item.libraryItemId.toString()}
            ocrResult={item.ocrResult}
          />
        </Card>
      ))}
      <Paginator
        pageSize={5}
        pageIndex={1}
        totalActualItem={predictResult?.otherItems.length}
        totalPage={Math.floor(predictResult?.otherItems.length / 5)}
        className="mt-6"
      />
    </div>
  )
}

export default PredictionOtherMatchesTab
