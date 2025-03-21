import React from "react"
import { Link } from "@/i18n/routing"
import getLibraryItem from "@/queries/library-item/get-libraryItem"
import { SquarePen } from "lucide-react"
import { getLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"
import { splitCamelCase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import NoData from "@/components/ui/no-data"
import { StyledReadMore } from "@/components/ui/read-more"
import { Separator } from "@/components/ui/separator"

type Props = {
  libraryItemId: string
}

const BookOverviewTab = async ({ libraryItemId }: Props) => {
  const t = await getTranslations("BookPage")
  const locale = await getLocale()
  const libraryItem = await getLibraryItem(libraryItemId)

  if (!libraryItem) {
    return <NoData />
  }

  return (
    <div>
      <section className="flex items-center gap-4">
        <div className="flex-1 rounded-lg border p-4 text-center shadow-md">
          <p className="text-sm font-semibold">{t("fields.publicationYear")}</p>
          <p>{libraryItem?.publicationYear}</p>
        </div>
        <div className="flex-1 rounded-lg border p-4 text-center shadow-md">
          <p className="text-sm font-semibold">{t("fields.Publisher")}</p>
          <p className="text-sm text-foreground">{libraryItem?.publisher}</p>
        </div>
        <div className="flex-1 rounded-lg border p-4 text-center shadow-md">
          <p className="text-sm font-semibold">{t("fields.language")}</p>
          <p className="text-sm capitalize text-foreground">
            {libraryItem?.originLanguage}
          </p>
        </div>
        <div className="flex-1 rounded-lg border p-4 text-center shadow-md">
          <p className="text-sm font-semibold">{t("fields.pageCount")}</p>
          <p className="text-sm text-foreground">{libraryItem?.pageCount}</p>
        </div>
      </section>

      <section className="space-y-4 text-sm">
        <p className="mt-4 text-sm font-semibold">
          {t("preview available in")} &nbsp;
          <span className="font-semibold capitalize text-primary underline">
            {libraryItem?.originLanguage}
          </span>
        </p>
        <StyledReadMore>{libraryItem.summary}</StyledReadMore>

        <div className="flex gap-4">
          <section className="flex-1 space-y-4 rounded-lg border p-4 shadow-md">
            <h1 className="text-xl font-bold text-primary">
              {t("book details")}
            </h1>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">{t("published in")}</p>
              <p className="flex-1">{libraryItem?.publicationPlace}</p>
            </div>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">{t("category")}</p>
              <p className="flex-1">
                {locale === "vi"
                  ? libraryItem.category.vietnameseName
                  : splitCamelCase(libraryItem.category.englishName)}
              </p>
            </div>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">{t("cutter number")}</p>
              <p className="flex-1">{libraryItem?.cutterNumber}</p>
            </div>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">{t("dimensions")}</p>
              <p className="flex-1">{libraryItem?.dimensions}</p>
            </div>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">{t("responsibility")}</p>
              <p className="flex-1">{libraryItem?.responsibility}</p>
            </div>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">
                {t("edition notes")}
              </h1>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">{t("genre")}</p>
                <p className="flex-1">{libraryItem?.genres}</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">{t("topic terms")}</p>
                <p className="flex-1">{libraryItem?.topicalTerms}</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">{t("general notes")}</p>
                <p className="flex-1">{libraryItem?.generalNote}</p>
              </div>
            </section>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">
                {t("classification")}
              </h1>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">
                  {t("classification number")}
                </p>
                <p className="flex-1">{libraryItem.classificationNumber}</p>
              </div>
            </section>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">
                {t("physical object")}
              </h1>

              <div className="flex items-center">
                <p className="w-1/2 font-semibold">{t("number of pages")}</p>
                <p className="flex-1">{libraryItem.pageCount}</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">{t("detail")}</p>
                <p className="flex-1">{libraryItem.physicalDetails}</p>
              </div>
            </section>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">
                {t("Id number")}
              </h1>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">{t("book shelf Id")}</p>
                <p className="flex-1">{libraryItem.shelf?.shelfId}</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">{t("isbn")}</p>
                <p className="flex-1">{libraryItem.isbn}</p>
              </div>
            </section>
          </section>

          <section className="h-fit flex-1 space-y-4 rounded-lg border p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">
                {t("community reviews")}
              </h1>
              <Link
                href="#"
                className="cursor-pointer font-semibold text-foreground underline"
              >
                {t("feedbacks")}
              </Link>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Page</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Meandering 100%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Enjoy ability</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Interesting 100%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Difficulty</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Advanced 100%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Length</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Short 100%
              </Badge>
            </div>

            {/* Add user's review */}
            <div className="mt-16 flex justify-end">
              <Link
                href="#"
                className="flex items-center gap-2 text-right font-semibold text-foreground underline"
              >
                <SquarePen size={16} /> {t("add your community review")}
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default BookOverviewTab
