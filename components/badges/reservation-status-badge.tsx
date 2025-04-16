"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EReservationQueueStatus } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: EReservationQueueStatus
}

const getTypeColor = (type: EReservationQueueStatus) => {
  switch (type) {
    case EReservationQueueStatus.ASSIGNED:
      return "info"
    case EReservationQueueStatus.CANCELLED:
      return "draft"
    case EReservationQueueStatus.COLLECTED:
      return "success"
    case EReservationQueueStatus.EXPIRED:
      return "danger"
    case EReservationQueueStatus.PENDING:
      return "warning"
    default:
      return "default"
  }
}

function ReservationStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.ReservationQueueStatus")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[84px] shrink-0 justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default ReservationStatusBadge
