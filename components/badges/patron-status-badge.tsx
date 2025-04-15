"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EPatronStatus } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: EPatronStatus
}

const getTypeColor = (type: EPatronStatus) => {
  switch (type) {
    case EPatronStatus.ACTIVE:
      return "success"
    case EPatronStatus.INACTIVE:
      return "warning"
    case EPatronStatus.DELETED:
      return "danger"
    default:
      return "default"
  }
}

function PatronStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.PatronStatus")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[84px] shrink-0 justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default PatronStatusBadge
