"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ESupplierType } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  status: ESupplierType
}

const getTypeColor = (type: ESupplierType) => {
  switch (type) {
    case ESupplierType.DISTRIBUTOR:
      return "info"
    case ESupplierType.PUBLISHER:
      return "progress"
    default:
      return "default"
  }
}

function SupplierTypeBadge({ status }: Props) {
  const t = useTranslations("Badges.SupplierType")

  return (
    <Badge variant={getTypeColor(status)} className="flex w-28 justify-center">
      {t(status.toString())}
    </Badge>
  )
}

export default SupplierTypeBadge
