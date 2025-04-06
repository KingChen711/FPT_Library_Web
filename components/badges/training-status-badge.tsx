"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ETrainingStatus } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  status: ETrainingStatus
}

const getTypeColor = (type: ETrainingStatus) => {
  switch (type) {
    case ETrainingStatus.COMPLETED:
      return "success"
    case ETrainingStatus.FAILED:
      return "danger"
    case ETrainingStatus.IN_PROGRESS:
      return "info"
  }
}

function TrainingStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.TrainingStatus")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[92px] justify-center"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default TrainingStatusBadge
