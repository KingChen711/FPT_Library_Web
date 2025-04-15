"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ECardStatus } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: ECardStatus
}

const getTypeColor = (type: ECardStatus) => {
  switch (type) {
    case ECardStatus.UNPAID:
      return "progress"
    case ECardStatus.PENDING:
      return "info"
    case ECardStatus.ACTIVE:
      return "success"
    case ECardStatus.REJECTED:
      return "draft"
    case ECardStatus.EXPIRED:
      return "warning"
    case ECardStatus.SUSPENDED:
      return "danger"
    default:
      return "default"
  }
}

function CardStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.CardStatus")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[120px] shrink-0 justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default CardStatusBadge
