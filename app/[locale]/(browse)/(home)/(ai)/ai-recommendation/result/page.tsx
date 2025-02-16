"use client"

import { Link } from "@/i18n/routing"
import { RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import RecommendationResultTab from "../_components/recommendation-result-tab"

enum ERecommendationTab {
  RESULT = "result",
}

const AiRecommendationResult = () => {
  return (
    <div>
      <Tabs defaultValue={ERecommendationTab.RESULT} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="flex w-1/6 items-center justify-start gap-2">
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value={ERecommendationTab.RESULT}
            >
              Result
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
        <TabsContent value={ERecommendationTab.RESULT}>
          <RecommendationResultTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AiRecommendationResult
