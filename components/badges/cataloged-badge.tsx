"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { Badge } from "../ui/badge"

type Props = {
  cataloged: boolean
}

const getTypeColor = (type: boolean) => {
  switch (type) {
    case false:
      return "draft"
    case true:
      return "success"
  }
}

function CatalogedBadge({ cataloged }: Props) {
  const t = useTranslations("Badges.Cataloged")
  return (
    <Badge
      variant={getTypeColor(cataloged)}
      className="flex w-[112px] shrink-0 justify-center"
    >
      {t(cataloged ? "Cataloged" : "Uncataloged")}
    </Badge>
  )
}

export default CatalogedBadge
