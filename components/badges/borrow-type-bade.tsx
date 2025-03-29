"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EBorrowType } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: EBorrowType
}

const getTypeColor = (type: EBorrowType) => {
  switch (type) {
    case EBorrowType.IN_LIBRARY:
      return "info"
    case EBorrowType.TAKE_HOME:
      return "progress"
    default:
      return "default"
  }
}

function BorrowTypeBadge({ status }: Props) {
  const t = useTranslations("Badges.BorrowType")
  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[96px] justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default BorrowTypeBadge
