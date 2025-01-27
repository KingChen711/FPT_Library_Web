import Image from "next/image"

import { getTranslations } from "@/lib/get-translations"
import { Card } from "@/components/ui/card"
import ColorfulTableCell from "@/components/ui/colorful-table-cell"
import { Label } from "@/components/ui/label"
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

import { dummyBooks } from "../../../_components/dummy-books"

const PredictionOcrDetailTab = async () => {
  const uploadedBook = dummyBooks[0]
  const detectedBook = dummyBooks[1]

  const t = await getTranslations("BookPage")

  if (!uploadedBook) {
    return <div>{t("Book not found")}</div>
  }
  return (
    <Card className="flex w-full flex-col rounded-lg border-2 p-4">
      {/* Book preview */}
      <div className="flex w-full gap-2">
        <section className="flex w-1/3 flex-col gap-2 p-4">
          <h1 className="text-center text-xl font-semibold">Uploaded Book</h1>
          <h1 className="text-center text-sm">Your uploaded Image</h1>
          <div className="flex justify-center">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image
                    src={uploadedBook.image}
                    alt={uploadedBook.title}
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
                  <TooltipItemContent id={uploadedBook.id.toString()} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        <section className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex w-full flex-col rounded-lg border-4 border-primary p-2 text-center shadow-lg">
            <Label className="text-lg font-semibold">Match percentage</Label>
            <p className="text-lg">90%</p>
          </div>
          <div className="flex w-full flex-col rounded-lg border-4 border-primary p-2 text-center shadow-lg">
            <Label className="text-lg font-semibold">Overall threshold</Label>
            <p className="text-lg text-danger">60%</p>
          </div>
        </section>

        <section className="flex w-1/3 flex-col gap-2 p-4">
          <h1 className="text-center text-xl font-semibold">Detected Book</h1>
          <h1 className="text-center text-sm">Detected Image</h1>
          <div className="flex justify-center">
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
          </div>
        </section>
      </div>

      {/* Book comparison */}
      <div className="flex w-full gap-4">
        <section className="w-1/3 overflow-hidden rounded-lg border-2">
          <h1 className="bg-draft p-2 font-semibold text-primary-foreground">
            OCR Text
          </h1>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <h1 className="bg-primary p-2 text-sm font-semibold text-primary-foreground">
                  The Hobbit or there and back again
                </h1>
              </TooltipTrigger>
              <TooltipContent align="end" className="border-2 bg-card">
                <div className="flex flex-col gap-2 text-card-foreground">
                  <h1 className="font-semibold">Assumption Values</h1>
                  <Separator />
                  <div className="flex flex-nowrap items-center justify-between gap-2">
                    <div className="font-semibold">Title:</div>
                    <div className="font-semibold text-danger">90%</div>
                  </div>
                  <div className="flex flex-nowrap items-center justify-between gap-2">
                    <div className="font-semibold">Author:</div>
                    <div className="font-semibold text-danger">90%</div>
                  </div>
                  <div className="flex flex-nowrap items-center justify-between gap-2">
                    <div className="font-semibold">Publisher:</div>
                    <div className="font-semibold text-danger">90%</div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="w-full overflow-y-auto">
            {[
              "The Hobbit or there and back again",
              "J.R.R TOLKIEN",
              "THE ENCHANTING PRELUDE TO",
              "THE LORD OF THE RINGS",
            ].map((item, index) => (
              <div
                key={index}
                className="border-t-2 p-1 px-2 text-xs font-normal hover:bg-muted/85 hover:opacity-95"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1 overflow-hidden rounded-lg border-2">
          <h1 className="bg-draft p-2 font-semibold text-primary-foreground">
            Comparison
          </h1>
          <Table className="w-full table-auto text-sm">
            <TableHeader>
              <TableRow className="border">
                <TableHead className="relative h-8 w-32 border">
                  <div className="absolute inset-0 flex items-center justify-center font-semibold">
                    <span className="absolute bottom-1 left-1 text-xs">
                      Fields
                    </span>
                    <span className="absolute right-1 top-1 text-xs">
                      Details
                    </span>
                  </div>
                  {/* Đường gạch chéo */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-black to-transparent [mask-image:linear-gradient(to_top_right,_transparent_49%,_black_49%,_black_51%,_transparent_51%)]" />
                </TableHead>
                <TableHead className="border text-center text-xs font-semibold">
                  Match Phrase
                </TableHead>
                <TableHead className="border text-center text-xs font-semibold">
                  Fuzziness
                </TableHead>
                <TableHead className="border text-center text-xs font-semibold">
                  Threshold
                </TableHead>
                <TableHead className="border text-center text-xs font-semibold">
                  Match Value
                </TableHead>
                <TableHead className="border text-center text-xs font-semibold">
                  Match Percentage
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center text-xs font-semibold text-muted-foreground">
                  Title
                </TableCell>
                <ColorfulTableCell number={90} mark="%" />
                <ColorfulTableCell number={90} mark="%" />
                <ColorfulTableCell number={36} mark="%" />
                <TableCell className="border text-xs text-secondary-foreground">
                  The hobbit or there and back again
                </TableCell>
                <ColorfulTableCell number={88} mark="%" />
              </TableRow>
              <TableRow>
                <TableCell className="text-center text-xs font-semibold text-muted-foreground">
                  Author
                </TableCell>
                <ColorfulTableCell number={90} mark="%" />
                <ColorfulTableCell number={90} mark="%" />
                <ColorfulTableCell number={43} mark="%" />
                <TableCell className="border text-xs text-secondary-foreground">
                  J.R.R TOLKIEN
                </TableCell>
                <ColorfulTableCell number={75} mark="%" />
              </TableRow>
              <TableRow>
                <TableCell className="text-center text-xs font-semibold text-muted-foreground">
                  Publisher
                </TableCell>
                <ColorfulTableCell number={10} mark="%" />
                <ColorfulTableCell number={20} mark="%" />
                <ColorfulTableCell number={45} mark="%" />
                <TableCell className="border text-xs text-secondary-foreground">
                  Not found
                </TableCell>
                <ColorfulTableCell number={36} mark="%" />
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </div>
    </Card>
  )
}

export default PredictionOcrDetailTab
