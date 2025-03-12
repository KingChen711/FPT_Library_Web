"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EStockTransactionType } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  type: EStockTransactionType
}

const getTypeColor = (type: EStockTransactionType) => {
  switch (type) {
    case EStockTransactionType.NEW:
      return "success"
    case EStockTransactionType.ADDITIONAL:
      return "info"
    case EStockTransactionType.DAMAGED:
      return "warning"
    case EStockTransactionType.TRANSFERRED:
      return "progress"
    case EStockTransactionType.LOST:
      return "danger"
    case EStockTransactionType.OUTDATED:
      return "danger"
    case EStockTransactionType.OTHER:
      return "draft"
    default:
      return "default"
  }
}

function StockTransactionTypeBadge({ type }: Props) {
  const t = useTranslations("Badges.StockTransactionType")

  return (
    <Badge variant={getTypeColor(type)} className="flex w-24 justify-center">
      {t(type.toString())}
    </Badge>
  )
}

export default StockTransactionTypeBadge
