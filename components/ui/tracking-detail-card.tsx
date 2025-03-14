import React from "react"
import { useLocale, useTranslations } from "next-intl"

import { type Category, type TrackingDetail } from "@/lib/types/models"
import { cn, formatPrice } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "./card"
import StockTransactionTypeBadge from "./stock-transaction-type-badge"

type Props = {
  trackingDetail: TrackingDetail
  category?: Category
  className?: string
  onClick?: () => void
}

function TrackingDetailCard({
  trackingDetail,
  category,
  className,
  onClick,
}: Props) {
  const locale = useLocale()
  const t = useTranslations("TrackingsManagementPage")
  return (
    <Card
      onClick={() => {
        if (onClick) onClick()
      }}
      className={cn(
        "max-w-[400px] !bg-card !text-card-foreground",
        onClick && "cursor-pointer",
        className
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="line-clamp-1 text-lg">
            {trackingDetail.itemName}
          </CardTitle>
          <StockTransactionTypeBadge
            type={trackingDetail.stockTransactionType}
          />
        </div>
        {category && (
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "vi" ? category.vietnameseName : category.englishName}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("Unit price")}
            </p>
            <p className="font-medium">
              {formatPrice(trackingDetail.unitPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("Item total")}
            </p>
            <p className="font-medium">{trackingDetail.itemTotal}</p>
          </div>

          {trackingDetail?.isbn && (
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">ISBN</p>
              <p className="font-mono text-sm">{trackingDetail?.isbn}</p>
            </div>
          )}

          {trackingDetail?.barcodeRangeFrom &&
            trackingDetail?.barcodeRangeTo && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("Barcode range")}
                </p>
                <div className="flex items-center gap-2 font-mono text-sm">
                  <span>{trackingDetail.barcodeRangeFrom}</span>
                  {trackingDetail.barcodeRangeFrom !==
                    trackingDetail.barcodeRangeTo && (
                    <>
                      <span>-</span>
                      <span>{trackingDetail.barcodeRangeTo}</span>
                    </>
                  )}
                </div>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TrackingDetailCard
