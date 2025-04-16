"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EBorrowRecordStatus } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: EBorrowRecordStatus
}

const getTypeColor = (type: EBorrowRecordStatus) => {
  switch (type) {
    case EBorrowRecordStatus.BORROWING:
      return "info"
    case EBorrowRecordStatus.LOST:
      return "progress"
    case EBorrowRecordStatus.OVERDUE:
      return "danger"
    case EBorrowRecordStatus.RETURNED:
      return "draft"
    default:
      return "default"
  }
}

function BorrowRecordStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.BorrowRecordStatus")
  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[96px] shrink-0 justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default BorrowRecordStatusBadge
