"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EBorrowRequestStatus } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  status: EBorrowRequestStatus
}

const getTypeColor = (type: EBorrowRequestStatus) => {
  switch (type) {
    case EBorrowRequestStatus.BORROWED:
      return "success"
    case EBorrowRequestStatus.CANCELLED:
      return "warning"
    case EBorrowRequestStatus.CREATED:
      return "info"
    case EBorrowRequestStatus.EXPIRED:
      return "danger"
    default:
      return "default"
  }
}

function BorrowRequestStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.BorrowRequestStatus")
  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[84px] justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default BorrowRequestStatusBadge
