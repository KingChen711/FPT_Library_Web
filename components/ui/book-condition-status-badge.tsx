"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EBookConditionStatus } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  status: EBookConditionStatus
}

const getTypeColor = (type: EBookConditionStatus) => {
  switch (type) {
    case EBookConditionStatus.DAMAGED:
      return "danger"
    case EBookConditionStatus.GOOD:
      return "success"
    case EBookConditionStatus.LOST:
      return "progress"
    case EBookConditionStatus.WORN:
      return "warning"
    default:
      return "default"
  }
}

function BookConditionStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.BookConditionStatus")
  return (
    <Badge variant={getTypeColor(status)} className="flex w-16 justify-center">
      {t(status)}
    </Badge>
  )
}

export default BookConditionStatusBadge
