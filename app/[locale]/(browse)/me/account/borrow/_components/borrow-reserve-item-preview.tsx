"use client"

import Image from "next/image"
import { format } from "date-fns"
import { BookOpen } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type LibraryItem, type ReservationQueue } from "@/lib/types/models"
import { cn, formatDate } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import BarcodeGenerator from "@/components/ui/barcode-generator"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import NoData from "@/components/ui/no-data"
import ParseHtml from "@/components/ui/parse-html"
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
import ReservationStatusBadge from "@/components/badges/reservation-status-badge"

type Props = {
  libraryItem: LibraryItem
  className?: string
  reservationQueue: ReservationQueue & {
    assignedDate?: string | null
    collectedDate?: string | null
    totalExtendPickup?: number
  }
  expandable?: boolean
}

const BorrowReserveItemPreview = ({
  libraryItem,
  className,
  expandable,
  reservationQueue: queue,
}: Props) => {
  const {
    category,
    coverImage,
    authors,
    pageCount,
    publicationYear,
    publisher,
    subTitle,
    summary,
    title,
  } = libraryItem

  const locale = useLocale()
  const t = useTranslations("BooksManagementPage")
  const tBorrowTracking = useTranslations("BookPage.borrow tracking")

  return (
    <Card
      className={cn(
        "relative w-full overflow-hidden rounded-md border-2",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row">
        <CardContent className="flex-1 p-4">
          <div className="flex w-full gap-4">
            <div className="relative aspect-[2/3] h-[180px] w-[120px] shrink-0 overflow-hidden rounded-md border">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <BookOpen className="size-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="mt-2 flex items-center justify-between">
                  <h3 className="line-clamp-1 text-lg font-bold">{title}</h3>
                </div>
                {subTitle && (
                  <p className="text-sm text-muted-foreground">{subTitle}</p>
                )}
              </div>

              {category && (
                <Badge>
                  {locale === "vi"
                    ? category.vietnameseName
                    : category.englishName}
                </Badge>
              )}

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {authors && authors.length > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">{t("Authors")}:</span>{" "}
                    {authors.map((a) => a.fullName).join(", ")}
                  </p>
                )}

                {publisher && (
                  <p className="text-sm">
                    <span className="font-medium">{t("Publisher")}:</span>{" "}
                    {publisher}
                  </p>
                )}

                {publicationYear && (
                  <p className="text-sm">
                    <span className="font-medium">{t("Year")}:</span>{" "}
                    {publicationYear}
                  </p>
                )}

                {pageCount && (
                  <p className="text-sm">
                    <span className="font-medium">{t("Page count")}:</span>{" "}
                    {pageCount}
                  </p>
                )}
              </div>

              {summary && (
                <div>
                  <ParseHtml className="line-clamp-2 text-sm" data={summary} />
                </div>
              )}
            </div>
          </div>

          {/* Sửa UI */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tBorrowTracking("status")}</TableHead>
                <TableHead>{tBorrowTracking("reservation date")}</TableHead>
                <TableHead>{tBorrowTracking("expiry date")}</TableHead>
                <TableHead>
                  {tBorrowTracking("expected available date")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <ReservationStatusBadge status={queue.queueStatus} />
                </TableCell>
                <TableCell>
                  {formatDate(queue.reservationDate.toString())}
                </TableCell>
                <TableCell>
                  {queue.expiryDate
                    ? formatDate(queue.expiryDate.toString())
                    : tBorrowTracking("not available")}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help underline decoration-dotted">
                          {formatDate(
                            queue.expectedAvailableDateMin
                              ? queue.expectedAvailableDateMin.toString()
                              : tBorrowTracking("not available")
                          )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {tBorrowTracking("expected available range")}:
                          {formatDate(
                            queue.expectedAvailableDateMin
                              ? queue.expectedAvailableDateMin.toString()
                              : tBorrowTracking("not available")
                          )}
                          -
                          {formatDate(
                            queue.expectedAvailableDateMax
                              ? queue.expectedAvailableDateMax.toString()
                              : tBorrowTracking("not available")
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <section className="space-y-4 rounded-xl p-6 shadow-md">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <div className="text-sm font-medium">
                  {tBorrowTracking("status")}
                </div>
                <div>{queue.queueStatus}</div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-medium">
                  {tBorrowTracking("isReservedAfterRequestFailed")}
                </div>
                <div>
                  {queue.isReservedAfterRequestFailed ? (
                    <Icons.Check />
                  ) : (
                    <Icons.X />
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-medium">
                  {tBorrowTracking("expiry date")}
                </div>
                <div>
                  {queue.expiryDate ? (
                    format(new Date(queue.expiryDate), "dd/MM/yyyy")
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-medium">
                  {tBorrowTracking("collectedDate")}
                </div>
                <div>{queue.collectedDate || <NoData />}</div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-medium">
                  {tBorrowTracking("assignedDate")}
                </div>
                <div>{queue.assignedDate || <NoData />}</div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-medium">
                  {tBorrowTracking("totalExtendPickup")}
                </div>
                <div>{queue.totalExtendPickup || <NoData />}</div>
              </div>

              {queue.libraryItemInstance && (
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium">
                    {tBorrowTracking("barcode")}
                  </div>
                  <BarcodeGenerator
                    options={{
                      width: 2,
                      height: 26,
                      fontSize: 16,
                    }}
                    value={queue.libraryItemInstance.barcode}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Sửa UI */}

          {expandable ? (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>{t("View more")}</AccordionTrigger>
                <AccordionContent asChild>
                  <ExpandInformation noBorderTop libraryItem={libraryItem} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <ExpandInformation libraryItem={libraryItem} />
          )}
        </CardContent>
      </div>
    </Card>
  )
}

export default BorrowReserveItemPreview

function ExpandInformation({
  libraryItem,
  noBorderTop = false,
}: {
  libraryItem: LibraryItem
  noBorderTop?: boolean
}) {
  const {
    accompanyingMaterial,
    additionalAuthors,
    bibliographicalNote,
    classificationNumber,
    cutterNumber,
    dimensions,
    ean,
    edition,
    estimatedPrice,
    generalNote,
    genres,
    isbn,
    language,
    physicalDetails,
    topicalTerms,
  } = libraryItem

  const t = useTranslations("BooksManagementPage")

  const formattedPrice = estimatedPrice
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(estimatedPrice)
    : null

  return (
    <div
      className={cn(
        "mt-2 space-y-3 border-t pt-2",
        noBorderTop && "mt-0 border-t-0 pt-0"
      )}
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2 md:grid-cols-3">
        {additionalAuthors && (
          <div>
            <span className="font-medium">{t("Additional authors")}:</span>{" "}
            {additionalAuthors}
          </div>
        )}

        {language && (
          <div>
            <span className="font-medium">{t("Language")}:</span> {language}
          </div>
        )}

        {edition && (
          <div>
            <span className="font-medium">{t("Edition")}:</span> {edition}
          </div>
        )}

        {isbn && (
          <div>
            <span className="font-medium">ISBN:</span> {isbn}
          </div>
        )}

        {ean && (
          <div>
            <span className="font-medium">EAN:</span> {ean}
          </div>
        )}

        {classificationNumber && (
          <div>
            <span className="font-medium">DDC:</span> {classificationNumber}
          </div>
        )}

        {cutterNumber && (
          <div>
            <span className="font-medium">{t("Cutter number")}:</span>{" "}
            {cutterNumber}
          </div>
        )}

        {estimatedPrice && (
          <div>
            <span className="font-medium">{t("Estimated price")}:</span>{" "}
            {formattedPrice}
          </div>
        )}

        {dimensions && (
          <div>
            <span className="font-medium">{t("Dimensions")}:</span> {dimensions}
          </div>
        )}

        {physicalDetails && (
          <div>
            <span className="font-medium">{t("Physical details")}:</span>{" "}
            {physicalDetails}
          </div>
        )}

        {accompanyingMaterial && (
          <div>
            <span className="font-medium">{t("Accompanying material")}:</span>{" "}
            {accompanyingMaterial}
          </div>
        )}
      </div>

      {genres && (
        <div className="text-sm">
          <span className="font-medium">{t("Genres")}:</span> {genres}
        </div>
      )}

      {topicalTerms && (
        <div className="text-sm">
          <span className="font-medium">{t("Topical terms")}:</span>{" "}
          {topicalTerms}
        </div>
      )}

      {generalNote && (
        <div className="text-sm">
          <span className="font-medium">{t("General note")}:</span>{" "}
          {generalNote}
        </div>
      )}

      {bibliographicalNote && (
        <div className="text-sm">
          <span className="font-medium">{t("Bibliographical note")}:</span>{" "}
          {bibliographicalNote}
        </div>
      )}
    </div>
  )
}
