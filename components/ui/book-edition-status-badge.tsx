"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EBookEditionStatus } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  status: EBookEditionStatus
}

const getTypeColor = (type: EBookEditionStatus) => {
  switch (type) {
    case EBookEditionStatus.DRAFT:
      return "draft"
    case EBookEditionStatus.PUBLISHED:
      return "info"
    case EBookEditionStatus.DELETED:
      return "danger"
    default:
      return "default"
  }
}

function BookEditionStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.BookEditionStatus")
  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[84px] justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default BookEditionStatusBadge
