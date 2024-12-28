"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EBookConditionStatus } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  status: EBookConditionStatus
}

function BookConditionStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.BookConditionStatus")
  return (
    <Badge
      variant={
        status === EBookConditionStatus.GOOD
          ? "success"
          : status === EBookConditionStatus.WORN
            ? "warning"
            : "danger"
      }
      className="flex w-16 justify-center"
    >
      {t(status)}
    </Badge>
  )
}

export default BookConditionStatusBadge
