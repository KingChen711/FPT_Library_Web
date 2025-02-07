"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { Badge } from "./badge"

type Props = {
  active: boolean
}

const getTypeColor = (type: boolean) => {
  switch (type) {
    case false:
      return "danger"
    case true:
      return "success"
  }
}

function ActiveBadge({ active }: Props) {
  const t = useTranslations("Badges.Active")
  return (
    <Badge
      variant={getTypeColor(active)}
      className="flex w-[84px] justify-center"
    >
      {t(active ? "Active" : "Inactive")}
    </Badge>
  )
}

export default ActiveBadge
