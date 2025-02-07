"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ETrackingType } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  type: ETrackingType
}

const getTypeColor = (type: ETrackingType) => {
  switch (type) {
    case ETrackingType.STOCK_IN:
      return "success"
    case ETrackingType.STOCK_OUT:
      return "warning"
    case ETrackingType.TRANSFER:
      return "progress"
    default:
      return "default"
  }
}

function TrackingTypeBadge({ type }: Props) {
  const t = useTranslations("Badges.TrackingType")

  return (
    <Badge variant={getTypeColor(type)} className="flex w-20 justify-center">
      {t(type.toString())}
    </Badge>
  )
}

export default TrackingTypeBadge
