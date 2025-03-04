"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ETransactionType } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  type: ETransactionType
}

const getTypeColor = (type: ETransactionType) => {
  switch (type) {
    case ETransactionType.DIGITAL_BORROW:
      return "info"
    case ETransactionType.FINE:
      return "danger"
    case ETransactionType.DIGITAL_EXTENSION:
      return "draft"
    case ETransactionType.LIBRARY_CARD_EXTENSION:
      return "progress"
    case ETransactionType.LIBRARY_CARD_REGISTER:
      return "success"
    default:
      return "default"
  }
}

function TransactionTypeBadge({ type }: Props) {
  const t = useTranslations("Badges.TransactionType")

  return (
    <Badge variant={getTypeColor(type)} className="flex w-fit justify-center">
      {t(type.toString())}
    </Badge>
  )
}

export default TransactionTypeBadge
