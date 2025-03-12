"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ENotificationType } from "@/lib/types/enums"

import { Badge } from "../ui/badge"

type Props = {
  type: ENotificationType
}

const getTypeColor = (type: ENotificationType) => {
  switch (type) {
    case ENotificationType.EVENT:
      return "success"
    case ENotificationType.NOTICE:
      return "info"
    case ENotificationType.REMINDER:
      return "danger"
    default:
      return "default"
  }
}

function NotificationTypeBadge({ type: status }: Props) {
  const t = useTranslations("Badges.NotificationType")
  return (
    <Badge variant={getTypeColor(status)} className="flex w-24 justify-center">
      {t(status.toString())}
    </Badge>
  )
}

export default NotificationTypeBadge
