"use client"

import { useTranslations } from "next-intl"

import { EBorrowDigitalStatus } from "@/lib/types/enums"

import { Badge } from "./badge"

type Props = {
  status: EBorrowDigitalStatus
}

const getTypeColor = (type: EBorrowDigitalStatus) => {
  switch (type) {
    case EBorrowDigitalStatus.Active:
      return "info"
    case EBorrowDigitalStatus.Expired:
      return "danger"
    case EBorrowDigitalStatus.Cancelled:
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
      className="flex w-[100px] justify-center text-nowrap"
    >
      {t(status.toString())}
    </Badge>
  )
}

export default BorrowDigitalStatusBadge
