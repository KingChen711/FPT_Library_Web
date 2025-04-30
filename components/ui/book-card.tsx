"use client"

import Image from "next/image"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
  type Shelf,
} from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"
import LocateButton from "./locate-button"
import ParseHtml from "./parse-html"

interface LibraryItemProps {
  libraryItem: BookEdition & {
    category?: Category
    libraryItemAuthors?: (LibraryItemAuthor & { author: Author })[]
    authors?: Author[]
    shelf?: Shelf | null
  }
  modal?: boolean
  className?: string
  showBorrowDuration?: boolean
  expandable?: boolean
  fetchShelf?: boolean
  canOpen?: boolean
}

export default function LibraryItemCard({
  libraryItem,
  modal,
  className,
  expandable,
  showBorrowDuration = false,
  fetchShelf = false,
  canOpen = false,
}: LibraryItemProps) {
  const {
    category,
    coverImage,
    libraryItemAuthors,
    authors,
    pageCount,
    publicationYear,
    publisher,
    subTitle,
    summary,
    title,
    shelfId,
  } = libraryItem

  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()

  const content = (
    <Card
      className={cn(
        "relative w-full max-w-[calc(95vw-640px)] overflow-hidden rounded-md border-2",
        modal && "max-w-[95vw]",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row">
        <CardContent className="flex-1 p-4">
          <div className="flex gap-4">
            <div className="relative h-[135px] w-[90px] shrink-0 overflow-hidden rounded-md border">
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
            <div className="space-y-3">
              <div>
                <div className="mt-2 flex items-center">
                  <h3 className="line-clamp-1 text-lg font-bold">{title}</h3>
                  <div className="absolute right-2 top-2 z-50 flex items-center gap-3">
                    {fetchShelf && shelfId && (
                      <LocateButton shelfId={shelfId} />
                    )}
                    {category && (
                      <>
                        <Badge>
                          {locale === "vi"
                            ? category.vietnameseName
                            : category.englishName}
                        </Badge>
                        {showBorrowDuration && category.totalBorrowDays && (
                          <Badge>
                            {locale === "vi"
                              ? category.totalBorrowDays + " ngày"
                              : category.totalBorrowDays + " days"}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {subTitle && (
                  <p className="text-sm text-muted-foreground">{subTitle}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {libraryItemAuthors && libraryItemAuthors.length > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">{t("Authors")}:</span>{" "}
                    {libraryItemAuthors
                      .map((a) => a.author.fullName)
                      .join(", ")}
                  </p>
                )}

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
                  <p className="text-sm font-medium">{t("Summary")}:</p>
                  <ParseHtml className="line-clamp-2 text-sm" data={summary} />
                </div>
              )}
            </div>
          </div>

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

  if (!canOpen) return <>{content}</>

  return <Link href={`/books/${libraryItem.libraryItemId}`}>{content}</Link>
}

function ExpandInformation({
  libraryItem,
  noBorderTop = false,
}: {
  libraryItem: BookEdition & {
    category?: Category
    libraryItemAuthors?: (LibraryItemAuthor & { author: Author })[]
    authors?: Author[]
  }
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
