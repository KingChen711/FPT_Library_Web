"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { ENotificationType } from "@/lib/types/enums"
import { cn } from "@/lib/utils"

import { Badge } from "./badge"

type Props = {
  type: ENotificationType
}

export const getTypeColor = (type: ENotificationType): string => {
  switch (type) {
    case ENotificationType.EVENT:
      return "bg-success"
    case ENotificationType.NOTICE:
      return "bg-info"
    case ENotificationType.REMINDER:
      return "bg-danger"
    default:
      return "bg-primary"
  }
}

function NotificationTypeBadge({ type: status }: Props) {
  const t = useTranslations("Badges.NotificationType")
  return (
    <Badge className={cn(`text-xs ${getTypeColor(status)}`)}>{t(status)}</Badge>
  )
}

export default NotificationTypeBadge
