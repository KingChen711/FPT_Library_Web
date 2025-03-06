"use client"

import React, { useState } from "react"
import { type TrackingDetails } from "@/queries/trackings/get-tracking-details"
import { Loader2, Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import {
  type EBookCopyConditionStatus,
  type ETrackingType,
} from "@/lib/types/enums"
import { cn, formatPrice } from "@/lib/utils"
import useConditions from "@/hooks/conditions/use-conditions"
import { Input } from "@/components/ui/input"
import NoData from "@/components/ui/no-data"
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

import AddTrackingDetailDialog from "../add-tracking-detail-dialog"
import ImportDetailsDialog from "../import-details-dialog"
import TrackingDetailActionsDropdown from "./tracking-detail-actions-dropdown"

type Props = {
  trackingDetails: TrackingDetails
  trackingId: number
  trackingType: ETrackingType
}

function TrackingDetailsSection({
  trackingDetails,
  trackingId,
  trackingType,
}: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()

  const [searchTerm, setSearchTerm] = useState("")
  const { data: conditions, isFetching: isFetchingConditions } = useConditions()

  const filteredTrackingDetails = trackingDetails

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-semibold">{t("Tracking details")}</h3>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className={cn(
              "flex max-w-md flex-1 items-center rounded-lg border-2 px-2"
            )}
          >
            <Search className="size-6" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder={locale === "vi" ? "Tìm kiếm..." : "Search..."}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ImportDetailsDialog trackingId={trackingId} />
          <AddTrackingDetailDialog
            trackingType={trackingType}
            trackingId={trackingId}
          />
        </div>
      </div>

      <div className="grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap font-bold">
                  {t("Item name")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">ISBN</TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Total item")}</div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Unit price")}</div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Total amount")}</div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Status")}</div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Actions")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrackingDetails.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex justify-center p-4">
                      <NoData />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {filteredTrackingDetails.map((trackingDetail) => (
                <TableRow key={trackingDetail.trackingDetailId}>
                  <TableCell className="text-nowrap font-bold">
                    {trackingDetail.itemName}
                  </TableCell>
                  <TableCell>{trackingDetail.isbn}</TableCell>
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
                      <CatalogedBadge
                        cataloged={!!trackingDetail.libraryItem}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {isFetchingConditions ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <BookConditionStatusBadge
                          status={
                            conditions?.find(
                              (c) =>
                                c.conditionId === trackingDetail.conditionId
                            )?.englishName as EBookCopyConditionStatus
                          }
                        />
                      )}
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
    </div>
  )
}

export default TrackingDetailsSection
