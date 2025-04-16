"use client"

import { useTranslations } from "next-intl"

import { EBorrowDigitalStatus } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  status: EBorrowDigitalStatus
}

const getTypeColor = (type: EBorrowDigitalStatus) => {
  switch (type) {
    case EBorrowDigitalStatus.ACTIVE:
      return "info"
    case EBorrowDigitalStatus.PREPARING:
      return "progress"
    case EBorrowDigitalStatus.EXPIRED:
      return "danger"
    case EBorrowDigitalStatus.CANCELLED:
      return "warning"
    default:
      return "draft"
  }
}

function BorrowDigitalStatusBadge({ status }: Props) {
  const t = useTranslations("Badges.BorrowDigitalStatus")

  return (
    <Badge
      variant={getTypeColor(status)}
      className="flex w-[108px] shrink-0 justify-center text-nowrap"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default BorrowDigitalStatusBadge
