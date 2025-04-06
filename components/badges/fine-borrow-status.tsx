"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EFineBorrowStatus } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: EFineBorrowStatus
}

const getTypeColor = (type: EFineBorrowStatus) => {
  switch (type) {
    case EFineBorrowStatus.PAID:
      return "info"
    case EFineBorrowStatus.PENDING:
      return "warning"
    case EFineBorrowStatus.EXPIRED:
      return "draft"
    default:
      return "default"
  }
}

function FineBorrowStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.FineBorrowStatus")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[120px] justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default FineBorrowStatusBadge
