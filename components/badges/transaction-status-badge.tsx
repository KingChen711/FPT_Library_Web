"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ETransactionStatus } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: ETransactionStatus
}

const getTypeColor = (type: ETransactionStatus) => {
  switch (type) {
    case ETransactionStatus.PENDING:
      return "info"
    case ETransactionStatus.PAID:
      return "success"
    case ETransactionStatus.EXPIRED:
      return "warning"
    case ETransactionStatus.CANCELLED:
      return "danger"
    default:
      return "default"
  }
}

function TransactionStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.TransactionStatus")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[108px] shrink-0 justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default TransactionStatusBadge
