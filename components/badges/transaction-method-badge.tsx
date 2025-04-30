"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ETransactionMethod } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  method: ETransactionMethod
}

const getTypeColor = (type: ETransactionMethod) => {
  switch (type) {
    case ETransactionMethod.CASH:
      return "success"
    case ETransactionMethod.DIGITAL_PAYMENT:
      return "info"
    default:
      return "default"
  }
}

function TransactionMethodBadge({ method }: Props) {
  const t = useTranslations("Badges.TransactionMethod")

  return (
    <Badge
      variant={getTypeColor(method)}
      className="flex w-20 shrink-0 justify-center"
    >
      {t(method.toString())}
    </Badge>
  )
}

export default TransactionMethodBadge
