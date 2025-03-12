import React from "react"
import { Link } from "@/i18n/routing"
import getLibraryItem from "@/queries/library-item/get-libraryItem"
import { SquarePen } from "lucide-react"
import { getLocale } from "next-intl/server"

import { splitCamelCase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { StyledReadMore } from "@/components/ui/read-more"
import { Separator } from "@/components/ui/separator"

type Props = {
  libraryItemId: string
}

const BookOverviewTab = async ({ libraryItemId }: Props) => {
  const locale = await getLocale()
  const libraryItem = await getLibraryItem(libraryItemId)

  if (!libraryItem) {
    return <div>Library item not found</div>
  }

  return (
    <div>
      <section className="flex items-center gap-4">
        <div className="flex-1 rounded-lg border p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Publish Year</p>
          <p>{libraryItem?.publicationYear}</p>
        </div>
        <div className="flex-1 rounded-lg border p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Publisher</p>
          <p className="text-sm text-danger">{libraryItem?.publisher}</p>
        </div>
        <div className="flex-1 rounded-lg border p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Language</p>
          <p className="text-sm capitalize text-danger">
            {libraryItem?.originLanguage}
          </p>
        </div>
        <div className="flex-1 rounded-lg border p-4 text-center shadow-md">
          <p className="text-sm font-semibold">Pages</p>
          <p className="text-sm text-danger">{libraryItem?.pageCount}</p>
        </div>
      </section>

      <section className="space-y-4 text-sm">
        <p className="mt-4 text-sm font-semibold">
          Preview available in &nbsp;
          <span className="font-semibold text-primary underline">English</span>
        </p>
        <StyledReadMore>{libraryItem.summary}</StyledReadMore>

        <div className="flex gap-4">
          <section className="flex-1 space-y-4 rounded-lg border p-4 shadow-md">
            <h1 className="text-xl font-bold text-primary">Book Details</h1>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">Published in</p>
              <p className="flex-1">{libraryItem?.publicationPlace}</p>
            </div>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">Category</p>
              <p className="flex-1">
                {locale === "vi"
                  ? libraryItem.category.vietnameseName
                  : splitCamelCase(libraryItem.category.englishName as string)}
              </p>
            </div>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">Cutter number</p>
              <p className="flex-1">{libraryItem?.cutterNumber}</p>
            </div>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">Dimensions</p>
              <p className="flex-1">{libraryItem?.dimensions}</p>
            </div>
            <div className="flex items-center">
              <p className="w-1/2 font-semibold">Responsibility</p>
              <p className="flex-1">{libraryItem?.responsibility}</p>
            </div>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">
                Edition Notes
              </h1>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Genre</p>
                <p className="flex-1">{libraryItem?.genres}</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Topic terms</p>
                <p className="flex-1">{libraryItem?.topicalTerms}</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">General notes</p>
                <p className="flex-1">{libraryItem?.generalNote}</p>
              </div>
            </section>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">
                Classifications
              </h1>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Dewey Decimal Class</p>
                <p className="flex-1">{libraryItem.classificationNumber}</p>
              </div>
            </section>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">
                The physical object
              </h1>

              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Number of pages</p>
                <p className="flex-1">{libraryItem.pageCount}</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">Detail</p>
                <p className="flex-1">{libraryItem.physicalDetails}</p>
              </div>
            </section>
            <Separator />
            <section className="space-y-2">
              <h1 className="text-lg font-semibold text-primary">ID Numbers</h1>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">My Book Shelf</p>
                <p className="flex-1">{libraryItem.shelf?.shelfId}</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/2 font-semibold">ISBN 10</p>
                <p className="flex-1">{libraryItem.isbn}</p>
              </div>
            </section>
          </section>

          <section className="h-fit flex-1 space-y-4 rounded-lg border p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">
                Community Reviews
              </h1>
              <Link
                href="#"
                className="cursor-pointer font-semibold text-danger underline"
              >
                Feedbacks
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
              <Label className="uppercase">Genre</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Horror 66%
              </Badge>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Mystery 33%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Mood</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Ominous 25%
              </Badge>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Scientific 25%
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Label className="uppercase">Impressions</Label>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Overheaped 50%
              </Badge>
              <Badge
                variant={"secondary"}
                className="text-nowrap font-normal capitalize"
              >
                Forgettable 50%
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
                className="flex items-center gap-2 text-right font-semibold text-danger underline"
              >
                <SquarePen size={16} /> Add your community review
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default BookOverviewTab
