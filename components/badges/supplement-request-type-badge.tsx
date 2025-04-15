"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ESupplementRequestItemType } from "@/lib/validations/supplement/create-supplement-request"

import { Badge } from "../ui/badge"

type Props = {
  status: ESupplementRequestItemType
}

const getTypeColor = (type: ESupplementRequestItemType) => {
  switch (type) {
    case ESupplementRequestItemType.CUSTOM:
      return "info"
    case ESupplementRequestItemType.TOP_CIRCULATION:
      return "success"
    default:
      return "default"
  }
}

function SupplementRequestTypeBadge({ status }: Props) {
  const t = useTranslations("Badges.SupplementRequestItemType")
  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[112px] shrink-0 justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default SupplementRequestTypeBadge
