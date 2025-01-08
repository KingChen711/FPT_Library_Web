"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EBookCopyConditionStatus } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  status: EBookCopyConditionStatus
}

const getTypeColor = (type: EBookCopyConditionStatus) => {
  switch (type) {
    case EBookCopyConditionStatus.DAMAGED:
      return "danger"
    case EBookCopyConditionStatus.GOOD:
      return "success"
    case EBookCopyConditionStatus.WORN:
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
