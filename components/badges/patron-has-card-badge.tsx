"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EPatronHasCard } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  hasCard: boolean
}

const getHasCardColor = (hasCard: boolean) => {
  switch (hasCard) {
    case true:
      return "info"
    case false:
      return "warning"
    default:
      return "default"
  }
}

function PatronHasCardBadge({ hasCard }: Props) {
  const t = useTranslations("Badges.PatronHasCard")

  return (
    <Badge
      variant={getHasCardColor(hasCard)}
      className="flex w-[84px] shrink-0 justify-center"
    >
      {t(
        hasCard
          ? EPatronHasCard.HAVE_CARD.toString()
          : EPatronHasCard.NO_CARD.toString()
      )}
    </Badge>
  )
}

export default PatronHasCardBadge
