"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ETrackingType } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  type: ETrackingType
}

const getTypeColor = (type: ETrackingType) => {
  switch (type) {
    case ETrackingType.STOCK_IN:
      return "success"
    case ETrackingType.STOCK_OUT:
      return "draft"
    case ETrackingType.STOCK_CHECKING:
      return "info"
    case ETrackingType.SUPPLEMENT_REQUEST:
      return "warning"
    default:
      return "default"
  }
}

function TrackingTypeBadge({ type }: Props) {
  const t = useTranslations("Badges.TrackingType")

  return (
    <Badge
      variant={getTypeColor(type)}
      className="flex w-[112px] shrink-0 justify-center"
    >
      {t(type.toString())}
    </Badge>
  )
}

export default TrackingTypeBadge
