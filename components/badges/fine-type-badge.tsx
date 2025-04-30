"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EFineType } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  type: EFineType
}

const getTypeColor = (type: EFineType) => {
  switch (type) {
    case EFineType.DAMAGE:
      return "danger"
    case EFineType.LOST:
      return "draft"
    case EFineType.OVER_DUE:
      return "progress"
    default:
      return "default"
  }
}

function FineTypeBadge({ type }: Props) {
  const t = useTranslations("Badges.FineType")

  return (
    <Badge
      variant={getTypeColor(type)}
      className="flex w-20 shrink-0 justify-center"
    >
      {t(type.toString())}
    </Badge>
  )
}

export default FineTypeBadge
