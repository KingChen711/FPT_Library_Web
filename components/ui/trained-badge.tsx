"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { Badge } from "./badge"

type Props = {
  trained: boolean
}

const getTypeColor = (type: boolean) => {
  switch (type) {
    case false:
      return "draft"
    case true:
      return "info"
  }
}

function TrainedBadge({ trained }: Props) {
  const t = useTranslations("Badges.Trained")
  return (
    <Badge variant={getTypeColor(trained)} className="flex justify-center">
      {t(trained ? "Trained" : "NotYet")}
    </Badge>
  )
}

export default TrainedBadge
