"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EBookCopyStatus } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: EBookCopyStatus
}

const getTypeColor = (type: EBookCopyStatus) => {
  switch (type) {
    case EBookCopyStatus.IN_SHELF:
      return "success"
    case EBookCopyStatus.OUT_OF_SHELF:
      return "warning"
    case EBookCopyStatus.BORROWED:
      return "info"
    case EBookCopyStatus.RESERVED:
      return "progress"
    case EBookCopyStatus.DELETED:
      return "danger"
    default:
      return "default"
  }
}

function BookCopyStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.BookCopyStatus")
  return (
    <Badge variant={getTypeColor(status)} className="flex w-24 justify-center">
      {t(status)}
    </Badge>
  )
}

export default BookCopyStatusBadge
