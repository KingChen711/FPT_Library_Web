"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { Badge } from "../ui/badge"

type Props = {
  circulated: boolean
}

const getTypeColor = (type: boolean) => {
  switch (type) {
    case false:
      return "progress"
    case true:
      return "info"
  }
}

function CirculatedBadge({ circulated }: Props) {
  const t = useTranslations("Badges.Circulated")
  return (
    <Badge
      variant={getTypeColor(circulated)}
      className="flex w-28 justify-center"
    >
      {t(circulated ? "Circulated" : "UnCirculated")}
    </Badge>
  )
}

export default CirculatedBadge
