"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EIssuanceMethod } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: EIssuanceMethod
}

const getTypeColor = (type: EIssuanceMethod) => {
  switch (type) {
    case EIssuanceMethod.IN_LIBRARY:
      return "progress"
    case EIssuanceMethod.ONLINE:
      return "info"
    default:
      return "default"
  }
}

function IssuanceMethodBadge({ status }: Props) {
  const t = useTranslations("Badges.IssuanceMethod")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-24 shrink-0 justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default IssuanceMethodBadge
