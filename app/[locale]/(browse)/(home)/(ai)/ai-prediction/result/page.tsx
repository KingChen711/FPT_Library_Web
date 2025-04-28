"use client"

import { Link } from "@/i18n/routing"
import { RefreshCcw } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import PredictionOcrDetailTab from "../_components/prediction-ocr-detail-tab"
import PredictionOtherMatchesTab from "../_components/prediction-other-matches-tab"
import PredictionResultTab from "../_components/prediction-result-tab"

enum EPredictionTab {
  RESULT = "result",
  OCR_DETAIL = "ocr-detail",
  OCR_DETECTS = "ocr-detects",
  OCR_MATCHES = "ocr-matches",
}

const AiPredictionResult = () => {
  const t = useTranslations("AI")

  return (
    <div>
      <Tabs defaultValue={EPredictionTab.RESULT} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="flex w-1/2 items-center gap-2">
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value={EPredictionTab.RESULT}
            >
              {t("result")}
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value={EPredictionTab.OCR_DETAIL}
            >
              {t("ocr detail")}
            </TabsTrigger>
            {/* <TabsTrigger
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value={EPredictionTab.OCR_DETECTS}
            >
              {t("ocr detects")}
            </TabsTrigger> */}
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value={EPredictionTab.OCR_MATCHES}
            >
              {t("other matches")}
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/ai-prediction">
                <RefreshCcw /> {t("try again")}
              </Link>
            </Button>
          </div>
        </div>

        <TabsContent value={EPredictionTab.RESULT}>
          <PredictionResultTab />
        </TabsContent>
        <TabsContent value={EPredictionTab.OCR_DETAIL}>
          <PredictionOcrDetailTab />
        </TabsContent>
        {/* <TabsContent value={EPredictionTab.OCR_DETECTS}>
          <PredictionOcrDetectTab />
        </TabsContent> */}
        <TabsContent value={EPredictionTab.OCR_MATCHES}>
          <PredictionOtherMatchesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AiPredictionResult
