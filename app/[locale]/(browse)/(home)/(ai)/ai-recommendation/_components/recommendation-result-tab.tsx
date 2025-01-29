import Image from "next/image"
import {
  CheckCircle2,
  CircleX,
  Filter,
  MapPin,
  Search,
  Star,
} from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import TooltipItemContent from "@/components/ui/tooltip-item-content"

import { dummyBooks } from "../../../_components/dummy-books"
import RecommendBookPreview from "./recommend-book-preview"

const RecommendationResultTab = async () => {
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
      <div className="flex w-full flex-col gap-4">
        <h1 className="text-xl font-semibold text-primary">
          Book Recommendations
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
            <Filter /> Filter
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Ratings</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Availability</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyBooks.map((book, index) => (
              <TableRow key={book.id}>
                <TableCell>
                  <div className="flex items-start gap-4">
                    <Image
                      src={book.image}
                      alt={book.title}
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
                          Highly recommended
                        </Badge>
                      )}
                      {index == 1 && (
                        <Badge
                          variant={"draft"}
                          className="flex w-[180px] flex-nowrap justify-center text-nowrap"
                        >
                          Medium recommended
                        </Badge>
                      )}
                      {index == 2 && (
                        <Badge
                          variant={"success"}
                          className="flex w-[180px] flex-nowrap justify-center text-nowrap"
                        >
                          Recommend recommended
                        </Badge>
                      )}
                      <p className="text-sm font-semibold">{book.title}</p>
                      <p className="text-xs">{book.author}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Star size={16} color="orange" fill="orange" /> 4.5 / 5
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <p>Computer science</p>
                    <p>UX design</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                      {t("fields.hard copy")}
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                      {t("fields.ebook")}
                    </div>
                    <div className="flex items-center gap-2">
                      <CircleX size={16} color="white" fill="#868d87" />
                      {t("fields.audio book")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="mt-2 space-y-2">
                      <Badge className="h-full w-fit bg-success hover:bg-success">
                        {t("fields.availability")}
                      </Badge>
                      <div className="flex items-center">
                        <MapPin color="white" fill="orange" /> CS A-15
                      </div>
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
                        Preview
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="left"
                      align="start"
                      className="w-[800px]"
                    >
                      <RecommendBookPreview
                        detectedBookId="1"
                        comparedBookId={book.id.toString()}
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

export default RecommendationResultTab
