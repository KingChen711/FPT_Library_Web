"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EPatronType } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  isEmployeeCreated: boolean
}

const getTypeColor = (type: boolean) => {
  switch (type) {
    case true:
      return "progress"
    case false:
      return "info"
    default:
      return "default"
  }
}

function PatronTypeBadge({ isEmployeeCreated }: Props) {
  const t = useTranslations("Badges.PatronType")

  return (
    <Badge
      variant={getTypeColor(isEmployeeCreated)}
      className="flex w-[116px] shrink-0 justify-center"
    >
      {t(
        isEmployeeCreated
          ? EPatronType.EMPLOYEE_MADE.toString()
          : EPatronType.SELF_MADE.toString()
      )}
    </Badge>
  )
}

export default PatronTypeBadge
