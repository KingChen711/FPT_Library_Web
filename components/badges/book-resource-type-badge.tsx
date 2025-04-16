"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: EResourceBookType
}

const getTypeColor = (type: EResourceBookType) => {
  switch (type) {
    case EResourceBookType.AUDIO_BOOK:
      return "info"
    case EResourceBookType.EBOOK:
      return "progress"
    default:
      return "default"
  }
}

function ResourceBookTypeBadge({ status }: Props) {
  const t = useTranslations("Badges.ResourceBookType")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[100px] shrink-0 justify-center"
    >
      {t(status)}
    </Badge>
  )
}

export default ResourceBookTypeBadge
