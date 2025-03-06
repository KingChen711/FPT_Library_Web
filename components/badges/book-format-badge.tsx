"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EBookFormat } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: EBookFormat
}

const getTypeColor = (type: EBookFormat) => {
  switch (type) {
    case EBookFormat.HARD_COVER:
      return "progress"
    case EBookFormat.PAPERBACK:
      return "warning"
    default:
      return "default"
  }
}

function BookFormatBadge({ status }: Props) {
  const t = useTranslations("Badges.BookFormat")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[100px] justify-center"
    >
      {t(status)}
    </Badge>
  )
}

export default BookFormatBadge
