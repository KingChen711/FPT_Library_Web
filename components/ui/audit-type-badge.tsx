"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { EAuditType } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  status: EAuditType
}

const getTypeColor = (type: EAuditType) => {
  switch (type) {
    case EAuditType.ADDED:
      return "success"
    case EAuditType.DELETED:
      return "danger"
    case EAuditType.MODIFIED:
      return "warning"
    default:
      return "draft"
  }
}

function AuditTypeBadge({ status }: Props) {
  const t = useTranslations("Badges.AuditType")

  return (
    <Badge variant={getTypeColor(status)} className="flex w-20 justify-center">
      {t(status.toString())}
    </Badge>
  )
}

export default AuditTypeBadge
