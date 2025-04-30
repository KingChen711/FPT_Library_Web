"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { Badge } from "../ui/badge"

type Props = {
  isPublic: boolean
}

function VisibilityBadge({ isPublic }: Props) {
  const t = useTranslations("Badges.Visibility")
  const content = t(isPublic ? "Public" : "Private")
  return (
    <Badge
      variant={isPublic ? "info" : "progress"}
      className="flex w-24 shrink-0 justify-center"
    >
      {content}
    </Badge>
  )
}

export default VisibilityBadge
