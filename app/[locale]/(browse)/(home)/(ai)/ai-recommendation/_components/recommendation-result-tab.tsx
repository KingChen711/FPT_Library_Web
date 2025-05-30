"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { usePrediction } from "@/stores/ai/use-prediction"
import {
  CheckCircle2,
  CircleX,
  Filter,
  Loader2,
  MapPin,
  Search,
  Star,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type LibraryItemsRecommendation } from "@/lib/types/models"
import useOcrDetail from "@/hooks/ai/use-ocr-detail"
import useLibraryItemRecommendation from "@/hooks/ai/use-recommendation"
import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LibraryItemInfo from "@/components/ui/library-item-info"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import RecommendBookPreview from "./recommend-book-preview"

const RecommendationResultTab = () => {
  const router = useRouter()
  const locale = useLocale()

  const t = useTranslations("AI")
  const { uploadedImage, bestMatchedLibraryItemId, predictResult } =
    usePrediction()

  const { data: ocrDetail, isLoading: isLoadingOcrDetail } = useOcrDetail(
    bestMatchedLibraryItemId,
    uploadedImage!
  )

  const { data: detectedLibraryItem, isLoading: isLoadingLibraryItem } =
    useLibraryItemDetail(bestMatchedLibraryItemId)

  const { data: recommendationResult, isLoading: isLoadingRecommendation } =
    useLibraryItemRecommendation(bestMatchedLibraryItemId)

  if (isLoadingOcrDetail || isLoadingRecommendation || isLoadingLibraryItem) {
    return <Loader2 className="animate-spin" />
  }

  if (
    !predictResult ||
    !bestMatchedLibraryItemId ||
    !uploadedImage ||
    !detectedLibraryItem ||
    !recommendationResult
  ) {
    router.push("/ai-recommendation")
    return
  }

  return (
    <Card className="flex w-full flex-col rounded-md border-2 p-4">
      {/* Book preview */}
      <div className="flex w-full gap-2">
        <section className="flex w-1/3 flex-col gap-2 p-4">
          <h1 className="text-center text-xl font-semibold">
            {t("uploaded book")}
          </h1>
          <h1 className="text-center text-sm">{t("your uploaded image")}</h1>
          <div className="flex justify-center">
            <Image
              src={URL.createObjectURL(uploadedImage)}
              alt={t("uploaded book")}
              width={200}
              height={300}
              className="rounded-md object-contain shadow-lg"
            />
          </div>
        </section>

        <section className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex w-full flex-col rounded-md border-4 border-primary p-2 text-center shadow-lg">
            <Label className="text-lg font-semibold">
              {t("match percentage")}
            </Label>
            <p className="text-lg">{ocrDetail?.matchPercentage.toFixed(2)}%</p>
          </div>
        </section>

        <section className="flex w-1/3 flex-col gap-2 p-4">
          <h1 className="text-center text-xl font-semibold">
            {t("detected book")}
          </h1>
          <h1 className="text-center text-sm">{t("detected image")}</h1>
          <div className="flex justify-center">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image
                    src={detectedLibraryItem.coverImage as string}
                    alt={detectedLibraryItem.title}
                    width={200}
                    height={300}
                    className="rounded-md object-contain shadow-lg"
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="max-h-[80vh] max-w-[calc(50vw-120px)] overflow-y-auto border-2 bg-card"
                >
                  <LibraryItemInfo
                    id={detectedLibraryItem?.libraryItemId}
                    libraryItem={detectedLibraryItem}
                    showInstances={false}
                    showResources={false}
                    shownInventory={true}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>
      </div>

      {/* Book comparison */}
      <div className="flex w-full flex-col gap-4">
        <h1 className="text-xl font-semibold text-primary">
          {t("book recommendations")}
        </h1>
        <div className="flex w-full items-center justify-start gap-4">
          <div className="relative w-1/3">
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by"
              className="pl-8"
              autoComplete="off"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Filter /> {t("filter")}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">{t("title")}</TableHead>
              <TableHead className="font-semibold">{t("ratings")}</TableHead>
              <TableHead className="font-semibold">{t("category")}</TableHead>
              <TableHead className="font-semibold">
                {t("availability")}
              </TableHead>
              <TableHead className="font-semibold">{t("status")}</TableHead>
              <TableHead className="font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recommendationResult &&
              recommendationResult?.map(
                (result: LibraryItemsRecommendation, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-start gap-4">
                        <Image
                          src={result?.itemDetailDto?.coverImage as string}
                          alt={result?.itemDetailDto?.title}
                          width={50}
                          height={75}
                          className="object-contain"
                        />
                        <div className="flex flex-col gap-2">
                          {index == 0 && (
                            <Badge
                              variant={"danger"}
                              className="flex w-[180px] flex-nowrap justify-center text-nowrap"
                            >
                              {t("highly recommended")}
                            </Badge>
                          )}
                          {index == 1 && (
                            <Badge
                              variant={"draft"}
                              className="flex w-[180px] flex-nowrap justify-center text-nowrap"
                            >
                              {t("medium recommended")}
                            </Badge>
                          )}
                          {index == 2 && (
                            <Badge
                              variant={"success"}
                              className="flex w-[180px] flex-nowrap justify-center text-nowrap"
                            >
                              {t("recommended")}
                            </Badge>
                          )}
                          <p className="text-sm font-semibold">
                            {result?.itemDetailDto?.title} -{" "}
                            {result?.itemDetailDto?.libraryItemId}
                          </p>
                          <p className="text-xs">
                            {result?.itemDetailDto?.authors.length > 0 &&
                              result?.itemDetailDto?.authors[0].fullName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star size={16} color="orange" fill="orange" />
                        {result?.itemDetailDto?.avgReviewedRate} / 5
                      </div>
                    </TableCell>
                    <TableCell>
                      {locale === "vi"
                        ? result?.itemDetailDto?.category?.vietnameseName
                        : result?.itemDetailDto?.category?.englishName}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            size={16}
                            color="white"
                            fill="#42bb4e"
                          />
                          {t("hard copy")}
                        </div>
                        <div className="flex items-center gap-2">
                          <CircleX size={16} color="white" fill="#868d87" />
                          {t("audio book")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="mt-2 space-y-2">
                          {result?.itemDetailDto?.libraryItemInventory &&
                          result?.itemDetailDto?.libraryItemInventory
                            .availableUnits > 0 ? (
                            <Badge variant={"success"}>
                              {t("availability")}
                            </Badge>
                          ) : (
                            <Badge variant={"danger"}>
                              {t("unavailability")}
                            </Badge>
                          )}
                          {result?.itemDetailDto?.shelf && (
                            <div className="flex items-center">
                              <MapPin color="white" fill="orange" />
                              {result?.itemDetailDto?.shelf?.shelfNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="bg-background text-danger hover:bg-background hover:text-danger"
                          >
                            {t("preview")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="left"
                          align="start"
                          className="h-[80vh] w-[800px] overflow-y-auto"
                        >
                          <RecommendBookPreview
                            result={result}
                            detectedLibraryItem={detectedLibraryItem}
                            comparedLibraryItemId={
                              result.itemDetailDto.libraryItemId
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

export default RecommendationResultTab
