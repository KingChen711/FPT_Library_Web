import React from "react"
import Image from "next/image"
import Link from "next/link"
import { type TrackingDetails } from "@/queries/trackings/get-tracking-details"
import { format } from "date-fns"
import { Check, Plus, Search, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import {
  type EBookCopyConditionStatus,
  type ETrackingType,
} from "@/lib/types/enums"
import { type Condition } from "@/lib/types/models"
import { cn, formatPrice } from "@/lib/utils"
import { type TSearchTrackingDetailsSchema } from "@/lib/validations/trackings/search-tracking-details"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Paginator from "@/components/ui/paginator"
import SearchForm from "@/components/ui/search-form"
import { Skeleton } from "@/components/ui/skeleton"
import SortableTableHead from "@/components/ui/sortable-table-head"
import StockTransactionTypeBadge from "@/components/ui/stock-transaction-type-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import BookConditionStatusBadge from "@/components/badges/book-condition-status-badge"
import CatalogedBadge from "@/components/badges/cataloged-badge"

// import AddTrackingDetailDialog from "../add-tracking-detail-dialog"
import ImportDetailsDialog from "../import-details-dialog"
import { FiltersTrackingDetailsDropdown } from "./filters-tracking-details-dropdown"
import TrackingDetailActionsDropdown from "./tracking-detail-actions-dropdown"

type Props = {
  trackingDetails: TrackingDetails
  trackingId: number
  trackingType: ETrackingType
  conditions: Condition[]
  searchParams: TSearchTrackingDetailsSchema
  totalPage: number
  totalActualItem: number
}

async function TrackingDetailsSection({
  trackingDetails,
  trackingId,
  trackingType,
  conditions,
  searchParams: { search, pageIndex, pageSize, sort, hasGlueBarcode },
  totalPage,
  totalActualItem,
}: Props) {
  const t = await getTranslations("TrackingsManagementPage")
  const locale = await getLocale()
  const formatLocale = await getFormatLocale()

  const filteredTrackingDetails = trackingDetails

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-semibold">{t("Tracking details")}</h3>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-full rounded-r-none border-r-0"
              search={search}
            />
            <FiltersTrackingDetailsDropdown
              hasGlueBarcode={hasGlueBarcode}
              trackingId={trackingId}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ImportDetailsDialog trackingId={trackingId} />
          <Button asChild>
            <Link href={`/management/trackings/${trackingId}/new-details`}>
              <Plus />
              {t("Add tracking detail")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Stock transaction type")}
                  </div>
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Item name")}
                  sortKey="ItemName"
                />

                <SortableTableHead
                  currentSort={sort}
                  label="ISBN"
                  sortKey="ISBN"
                  position="center"
                />

                <TableHead className="text-nowrap font-bold">
                  {t("Category")}
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Barcode range")}
                  sortKey="BarcodeRangeFrom"
                  position="center"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Total item")}
                  sortKey="ItemTotal"
                  position="center"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Unit price")}
                  sortKey="UnitPrice"
                  position="center"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Total amount")}
                  sortKey="TotalAmount"
                  position="center"
                />

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Has glue barcode")}
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Condition")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Status")}</div>
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Created at")}
                  sortKey="CreatedAt"
                  position="center"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Created by")}
                  sortKey="CreatedBy"
                  position="center"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Updated at")}
                  sortKey="UpdatedAt"
                  position="center"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Updated by")}
                  sortKey="UpdatedBy"
                  position="center"
                />

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Actions")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrackingDetails.map((trackingDetail) => (
                <TableRow key={trackingDetail.trackingDetailId}>
                  <TableCell className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      <StockTransactionTypeBadge
                        type={trackingDetail.stockTransactionType}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {trackingDetail.libraryItem ? (
                      <Link
                        target="_blank"
                        href={`/management/books/${trackingDetail.libraryItem.libraryItemId}`}
                        className="group flex items-center gap-2 pr-8"
                      >
                        {trackingDetail.libraryItem.coverImage ? (
                          <Image
                            alt={trackingDetail.libraryItem.title}
                            src={trackingDetail.libraryItem.coverImage}
                            width={40}
                            height={60}
                            className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                          />
                        ) : (
                          <div className="h-12 w-8 rounded-sm border"></div>
                        )}
                        <p className="font-bold group-hover:underline">
                          {trackingDetail.libraryItem.title}
                        </p>
                      </Link>
                    ) : (
                      <div className="flex justify-center">
                        {trackingDetail.isbn}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {trackingDetail.isbn}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {locale === "vi"
                      ? trackingDetail.category.vietnameseName
                      : trackingDetail.category.englishName}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {trackingDetail.barcodeRangeFrom ===
                      trackingDetail.barcodeRangeTo
                        ? trackingDetail.barcodeRangeTo
                        : `${trackingDetail.barcodeRangeFrom} - ${trackingDetail.barcodeRangeTo}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {trackingDetail.itemTotal}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {formatPrice(trackingDetail.unitPrice)}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {formatPrice(trackingDetail.totalAmount)}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {trackingDetail.hasGlueBarcode ? (
                        <Check className="text-success" />
                      ) : (
                        <X className="text-danger" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <BookConditionStatusBadge
                        status={
                          conditions?.find(
                            (c) => c.conditionId === trackingDetail.conditionId
                          )?.englishName as EBookCopyConditionStatus
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <CatalogedBadge
                        cataloged={!!trackingDetail.libraryItem}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {trackingDetail.createdAt
                        ? format(
                            new Date(trackingDetail.createdAt),
                            "dd MMM yyyy",
                            {
                              locale: formatLocale,
                            }
                          )
                        : "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {trackingDetail.createdBy || "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {trackingDetail.updatedAt
                        ? format(
                            new Date(trackingDetail.updatedAt),
                            "dd MMM yyyy",
                            {
                              locale: formatLocale,
                            }
                          )
                        : "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {trackingDetail.updatedBy || "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <TrackingDetailActionsDropdown
                        trackingDetail={trackingDetail}
                        trackingType={trackingType}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Paginator
        pageSize={+pageSize}
        pageIndex={pageIndex}
        totalPage={totalPage}
        totalActualItem={totalActualItem}
        className="mt-6"
      />
    </div>
  )
}

export default TrackingDetailsSection

export function TrackingDetailsSectionSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-8 w-48" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className={cn(
              "flex max-w-md flex-1 items-center rounded-md border-2 px-2"
            )}
          >
            <Search className="size-6 text-muted-foreground" />
            <Input
              disabled
              className="rounded-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder="Search..."
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" disabled className="gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-4 w-16" />
          </Button>
        </div>
      </div>

      <div className="grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-12" />
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-20" />
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-20" />
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-28" />
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-16" />
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-16" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-28" />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <Skeleton className="size-6 rounded-full" />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <Skeleton className="size-8 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
