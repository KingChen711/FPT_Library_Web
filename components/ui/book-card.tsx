"use client"

import Image from "next/image"
import { BookOpen } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
} from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import ParseHtml from "./parse-html"

interface LibraryItemProps {
  libraryItem: BookEdition & {
    category?: Category
    libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
  }
  modal?: boolean
}

export default function LibraryItemCard({
  libraryItem,
  modal,
}: LibraryItemProps) {
  const {
    accompanyingMaterial,
    additionalAuthors,

    bibliographicalNote,

    category,

    classificationNumber,
    coverImage,

    cutterNumber,
    dimensions,
    ean,
    edition,

    estimatedPrice,
    generalNote,
    genres,

    isbn,
    language,
    libraryItemAuthors,

    pageCount,
    physicalDetails,

    publicationYear,
    publisher,

    subTitle,
    summary,
    title,
    topicalTerms,
  } = libraryItem

  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()

  // Format price with VND currency
  const formattedPrice = estimatedPrice
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(estimatedPrice)
    : null

  return (
    <Card
      className={cn(
        "relative w-full max-w-[calc(95vw-640px)] overflow-hidden rounded-md border-2",
        modal && "max-w-[95vw]"
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
                  {category && (
                    <Badge className="absolute right-2 top-2">
                      {locale === "vi"
                        ? category.vietnameseName
                        : category.englishName}
                    </Badge>
                  )}
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

          <div className="mt-2 space-y-3 border-t pt-2">
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2 md:grid-cols-3">
              {additionalAuthors && (
                <div>
                  <span className="font-medium">
                    {t("Additional authors")}:
                  </span>{" "}
                  {additionalAuthors}
                </div>
              )}

              {language && (
                <div>
                  <span className="font-medium">{t("Language")}:</span>{" "}
                  {language}
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
                  <span className="font-medium">DDC:</span>{" "}
                  {classificationNumber}
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
                  <span className="font-medium">{t("Dimensions")}:</span>{" "}
                  {dimensions}
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
                  <span className="font-medium">
                    {t("Accompanying material")}:
                  </span>{" "}
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
                <span className="font-medium">
                  {t("Bibliographical note")}:
                </span>{" "}
                {bibliographicalNote}
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
