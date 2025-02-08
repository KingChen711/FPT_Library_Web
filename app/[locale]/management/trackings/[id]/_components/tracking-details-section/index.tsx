"use client"

import React, { useEffect, useState } from "react"
import { type TrackingDetails } from "@/queries/trackings/get-tracking-details"
import { format } from "date-fns"
import { CheckSquare, Search, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { cn, formatPrice } from "@/lib/utils"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import CatalogedBadge from "@/components/ui/cataloged-badge"
import { Checkbox } from "@/components/ui/checkbox"
import FileSize from "@/components/ui/file-size"
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
import { TabsContent } from "@/components/ui/tabs"

type Props = {
  trackingDetails: TrackingDetails
  trackingId: number
}

function TrackingDetailsSection({ trackingDetails, trackingId }: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()
  const formatLocale = useFormatLocale()
  const [searchTerm, setSearchTerm] = useState("")

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
        {/* <div className="flex flex-wrap items-center gap-4">
          {selectedTrackingDetailIds.length > 0 && (
            <TrackingDetailsActionsDropdown
              bookId={bookId}
              selectedTrackingDetailIds={selectedTrackingDetailIds}
              setSelectedTrackingDetailIds={setSelectedTrackingDetailIds}
              tab={tab}
            />
          )}
          <CreateTrackingDetailDialog bookId={bookId} />
        </div> */}
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
                  {t("Actions")}
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

                  <TableCell className="text-nowrap">TODO:Actions</TableCell>
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
