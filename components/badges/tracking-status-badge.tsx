"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ETrackingStatus } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: ETrackingStatus
}

const getTypeColor = (type: ETrackingStatus) => {
  switch (type) {
    case ETrackingStatus.CANCELLED:
      return "danger"
    case ETrackingStatus.COMPLETED:
      return "success"
    case ETrackingStatus.DRAFT:
      return "draft"
    default:
      return "default"
  }
}

function TrackingStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.TrackingStatus")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[92px] justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default TrackingStatusBadge
