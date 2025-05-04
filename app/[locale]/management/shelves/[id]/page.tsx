import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getShelf from "@/queries/shelves/get-shelf"

import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Copitor from "@/components/ui/copitor"
import NoData from "@/components/ui/no-data"
import ShelfBadge from "@/components/badges/shelf-badge"

import LibraryItemSection from "./library-items-section"

type Props = {
  params: { id: number }
}

async function ShelfDetailPage({ params }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  const id = Number(params.id)
  if (!id) notFound()

  const shelf = await getShelf(id)

  if (!shelf) notFound()

  const locale = await getLocale()

  const title = locale === "vi" ? shelf.vieShelfName : shelf.engShelfName

  const t = await getTranslations("ShelvesManagementPage")

  return (
    <div className="pb-8">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/management/shelves">
                {t("Shelves")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">{title}</h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <div className="flex items-center justify-between gap-4 px-5">
            <h3 className="text-lg font-semibold">{t("Shelf")}</h3>
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Shelf number")}</h4>
              <div className="flex items-center gap-2">
                <Copitor content={title} />
                {title || <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Classification number range")}</h4>
              <div className="flex gap-2">
                {Array(
                  Math.max(
                    3 - shelf.classificationNumberRangeFrom.toString().length,
                    0
                  )
                )
                  .fill("0")
                  .join("") + shelf.classificationNumberRangeFrom}
                -
                {Array(
                  Math.max(
                    3 - shelf.classificationNumberRangeTo.toString().length,
                    0
                  )
                )
                  .fill("0")
                  .join("") + shelf.classificationNumberRangeTo}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Shelf number")}</h4>
              <div className="flex gap-2">
                <div className="flex justify-center">
                  <ShelfBadge shelfNumber={shelf.shelfNumber} />
                </div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Total units")}</h4>
              <div className="flex gap-2">{shelf.unitSummary.totalUnits}</div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total available units")}</h4>
              <div className="flex gap-2">
                {shelf.unitSummary.totalAvailableUnits}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Total request units")}</h4>
              <div className="flex gap-2">
                {shelf.unitSummary.totalRequestUnits}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total borrowed units")}</h4>
              <div className="flex gap-2">
                {shelf.unitSummary.totalBorrowedUnits}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Total reserved units")}</h4>
              <div className="flex gap-2">
                {shelf.unitSummary.totalReservedUnits}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total overdue units")}</h4>
              <div className="flex gap-2">
                {shelf.unitSummary.totalOverdueUnits}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Total can borrow")}</h4>
              <div className="flex gap-2">
                {shelf.unitSummary.totalCanBorrow}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total damage units")}</h4>
              <div className="flex gap-2">
                {shelf.unitSummary.totalDamagedUnits}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Total lost units")}</h4>
              <div className="flex gap-2">
                {shelf.unitSummary.totalLostUnits}
              </div>
            </div>
          </div>
        </div>

        <LibraryItemSection libraryItems={shelf.libraryItems} />
      </div>
    </div>
  )
}

export default ShelfDetailPage
