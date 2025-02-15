"use client"

import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import { usePrediction } from "@/stores/ai/use-prediction"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import useOcrDetail from "@/hooks/ai/use-ocr-detail"
import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import { Card } from "@/components/ui/card"
import ColorfulTableCell from "@/components/ui/colorful-table-cell"
import { Label } from "@/components/ui/label"
import LibraryItemInfo from "@/components/ui/library-item-info"
import { Separator } from "@/components/ui/separator"
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
import TooltipItemContent from "@/components/ui/tooltip-item-content"

const PredictionOcrDetailTab = () => {
  const t = useTranslations("BookPage")
  const router = useRouter()
  const { uploadedImage, bestMatchedLibraryItemId, predictResult } =
    usePrediction()

  const { data: ocrDetail, isLoading } = useOcrDetail(
    bestMatchedLibraryItemId?.toString() as string,
    uploadedImage!
  )

  const { data: libraryItem, isLoading: isLoadingLibraryItem } =
    useLibraryItemDetail(bestMatchedLibraryItemId?.toString() || "")

  if (isLoading || !ocrDetail || isLoadingLibraryItem) {
    return <Loader2 className="animate-spin" />
  }

  if (!predictResult || !bestMatchedLibraryItemId || !uploadedImage) {
    router.push("/ai-prediction")
    return
  }

  return (
    <Card className="flex w-full flex-col rounded-lg border-2 p-4">
      {/* Book preview */}
      <div className="flex w-full">
        <section className="flex flex-1 flex-col gap-2 p-4">
          <h1 className="text-center text-xl font-semibold">Uploaded Book</h1>
          <h1 className="text-center">Your uploaded Image</h1>
          <div className="flex justify-center">
            <Image
              src={URL.createObjectURL(uploadedImage)}
              alt={"Uploaded Book"}
              width={180}
              height={240}
              className="rounded-lg object-contain shadow-lg"
            />
          </div>
        </section>

        <section className="flex w-1/5 flex-col items-center justify-center gap-4">
          <div className="flex w-full flex-col rounded-lg border-4 border-primary p-2 text-center shadow-lg">
            <Label className="text-lg font-semibold">Match percentage</Label>
            <p className="text-lg">{ocrDetail?.matchPercentage}%</p>
          </div>
          <div className="flex w-full flex-col rounded-lg border-4 border-primary p-2 text-center shadow-lg">
            <Label className="text-lg font-semibold">Overall threshold</Label>
            <p className="text-lg text-danger">
              {ocrDetail?.overallPercentage}%
            </p>
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-2 p-4">
          <h1 className="text-center text-xl font-semibold">Detected Book</h1>
          <h1 className="text-center">Detected Image</h1>
          <div className="flex justify-center">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image
                    src={libraryItem?.coverImage as string}
                    alt={"Detected Book"}
                    width={180}
                    height={240}
                    className="rounded-lg object-contain shadow-lg"
                  />
                </TooltipTrigger>
                <TooltipContent
                  align="start"
                  side="left"
                  className="max-h-[60vh] overflow-y-auto border-2 bg-card"
                >
                  {/* <TooltipItemContent
                    id={libraryItem?.libraryItemId?.toString() as string}
                  /> */}
                  <LibraryItemInfo
                    id={libraryItem?.libraryItemId?.toString() as string}
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
      <div className="flex w-full gap-4">
        <section className="flex flex-1 justify-center">
          <div className="w-3/4 overflow-hidden rounded-lg border-2">
            <h1 className="bg-draft p-2 font-semibold text-primary-foreground">
              OCR Text
            </h1>

            <div className="w-full overflow-y-auto">
              {ocrDetail &&
                ocrDetail?.lineStatisticDtos?.map((item, index) => (
                  <TooltipProvider key={index} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h1 className="border-b-2 px-2 hover:bg-primary hover:font-semibold hover:text-primary-foreground">
                          {item.lineValue}
                        </h1>
                      </TooltipTrigger>
                      <TooltipContent align="end" className="border-2 bg-card">
                        <div className="flex flex-col gap-2 text-card-foreground">
                          <h1 className="font-semibold">Assumption Values</h1>
                          <Separator />
                          <div className="flex flex-nowrap items-center justify-between gap-2">
                            <div className="font-semibold">Title:</div>
                            <div className="font-semibold text-danger">
                              {item.matchedTitlePercentage}%
                            </div>
                          </div>
                          <div className="flex flex-nowrap items-center justify-between gap-2">
                            <div className="font-semibold">Author:</div>
                            <div className="font-semibold text-danger">
                              {item.matchedAuthorPercentage}%
                            </div>
                          </div>
                          <div className="flex flex-nowrap items-center justify-between gap-2">
                            <div className="font-semibold">Publisher:</div>
                            <div className="font-semibold text-danger">
                              {item.matchedPublisherPercentage}%
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </div>
          </div>
        </section>

        <section className="flex-1 overflow-hidden rounded-lg border-2">
          <h1 className="bg-draft p-2 font-semibold text-primary-foreground">
            Comparison
          </h1>
          <div className="w-full overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="border">
                  <TableHead className="sticky left-0 z-10 w-[140px] border bg-background">
                    <div className="absolute inset-0 flex items-center justify-center font-semibold">
                      <span className="absolute bottom-1 left-1">Fields</span>
                      <span className="absolute right-1 top-1">Details</span>
                    </div>
                    {/* Đường gạch chéo */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-black to-transparent [mask-image:linear-gradient(to_top_right,_transparent_49%,_black_49%,_black_51%,_transparent_51%)]" />
                  </TableHead>
                  <TableHead className="w-[140px] border text-center font-semibold">
                    Match Phrase
                  </TableHead>
                  <TableHead className="w-[140px] border text-center font-semibold">
                    Fuzziness
                  </TableHead>
                  <TableHead className="w-[140px] border text-center font-semibold">
                    Threshold
                  </TableHead>
                  <TableHead className="w-[140px] border text-center font-semibold">
                    Match Value
                  </TableHead>
                  <TableHead className="w-[140px] text-nowrap border text-center font-semibold">
                    Match Percentage
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ocrDetail &&
                  ocrDetail?.stringComparisions?.map((item, index) => (
                    <TableRow key={item?.propertyName}>
                      <TableCell className="sticky left-0 z-10 w-[200px] border bg-background text-center font-semibold capitalize">
                        {item.propertyName}
                      </TableCell>
                      <ColorfulTableCell
                        number={item?.matchPhrasePoint}
                        threshold={item.fieldThreshold}
                        mark="%"
                      />
                      <ColorfulTableCell
                        number={item?.fuzzinessPoint}
                        threshold={item.fieldThreshold}
                        mark="%"
                      />
                      <ColorfulTableCell
                        number={item?.fieldThreshold}
                        threshold={item.fieldThreshold}
                        mark="%"
                      />
                      <TableCell className="border text-xs text-secondary-foreground">
                        {item?.matchLine}
                      </TableCell>
                      <ColorfulTableCell
                        number={item?.matchPercentage}
                        threshold={item.fieldThreshold}
                        mark="%"
                      />
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </Card>
  )
}

export default PredictionOcrDetailTab
