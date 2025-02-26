import { Link } from "@/i18n/routing"
import { RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import PredictionOcrDetailTab from "../_components/prediction-ocr-detail-tab"
import PredictionOcrDetectTab from "../_components/prediction-ocr-detect-tab"
import PredictionOtherMatchesTab from "../_components/prediction-other-matches-tab"
import PredictionResultTab from "../_components/prediction-result-tab"

enum EPredictionTab {
  RESULT = "result",
  OCR_DETAIL = "ocr-detail",
  OCR_DETECTS = "ocr-detects",
  OCR_MATCHES = "ocr-matches",
}

const AiPredictionResult = () => {
  // const { uploadedImage, bestMatchedLibraryItemId } = usePrediction()

  return (
    <div>
      <Tabs defaultValue={EPredictionTab.RESULT} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="flex w-1/2 items-center gap-2">
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value={EPredictionTab.RESULT}
            >
              Result
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value={EPredictionTab.OCR_DETAIL}
            >
              OCR detail
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value={EPredictionTab.OCR_DETECTS}
            >
              OCR detects
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value={EPredictionTab.OCR_MATCHES}
            >
              Other matches
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/ai-prediction">
                <RefreshCcw /> Try again
              </Link>
            </Button>
            <Button variant={"outline"}>Reset</Button>
          </div>
        </div>

        <TabsContent value={EPredictionTab.RESULT}>
          <PredictionResultTab />
        </TabsContent>
        <TabsContent value={EPredictionTab.OCR_DETAIL}>
          <PredictionOcrDetailTab />
        </TabsContent>
        <TabsContent value={EPredictionTab.OCR_DETECTS}>
          <PredictionOcrDetectTab />
        </TabsContent>
        <TabsContent value={EPredictionTab.OCR_MATCHES}>
          <PredictionOtherMatchesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AiPredictionResult
