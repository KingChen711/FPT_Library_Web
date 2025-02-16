"use client"

import { format } from "date-fns"
import { useTranslations } from "next-intl"

import { type Supplier, type Tracking } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import TrackingStatusBadge from "@/components/ui/tracking-status-badge"
import TrackingTypeBadge from "@/components/ui/tracking-type-badge"

interface TrackingCardProps {
  tracking: Tracking & { supplier: Supplier }
  onClick?: () => void
  className?: string
}

export function TrackingCard({
  tracking,
  onClick,
  className,
}: TrackingCardProps) {
  const t = useTranslations("BooksManagementPage")
  const formatDate = (date: Date | null) => {
    return date ? format(date, "dd/MM/yyyy") : "N/A"
  }

  return (
    <Card
      onClick={() => {
        if (onClick) onClick()
      }}
      className={cn(
        "min-w-60 max-w-72",
        onClick && "cursor-pointer",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {t("Receipt number")}:
            </span>
            <span className="line-clamp-1 text-sm font-bold">
              {tracking.receiptNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {t("Supplier")}:
            </span>
            <span className="line-clamp-1 text-sm">
              {tracking.supplier.supplierName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="line-clamp-1 text-sm font-medium text-muted-foreground">
              {t("Entry date")}:
            </span>
            <span className="text-sm">{formatDate(tracking.entryDate)}</span>
          </div>
          <div className="flex justify-between">
            <TrackingTypeBadge type={tracking.trackingType} />
            <TrackingStatusBadge status={tracking.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
