"use client"

import React, { useState, useTransition } from "react"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EReservationQueueStatus } from "@/lib/types/enums"
import { extendReservation } from "@/actions/borrows/extend-reservation"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"

import AssignItemDialog from "./assign-item-dialog"
import ConfirmApplyLabelDialog from "./confirm-apply-label-dialog"

type Props = {
  reservationId: number
  canAssign: boolean
  isAppliedLabel: boolean
  reservationCode: string | null
  reservationDate: Date
  assignedDate: Date | null
  expiryDate: Date | null
  fullName: string
  cardBarcode: string
  status: EReservationQueueStatus
}

function ReservationActionsDropdown({
  reservationId,
  canAssign,
  isAppliedLabel,
  assignedDate,
  cardBarcode,
  expiryDate,
  fullName,
  reservationCode,
  reservationDate,
  status,
}: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const locale = useLocale()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openAssign, setOpenAssign] = useState(false)
  const [openConfirmApply, setOpenConfirmApply] = useState(false)
  const [extending, startExtend] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (extending) return
    setOpenDropdown(value)
  }

  const handelExtend = () => {
    startExtend(async () => {
      const res = await extendReservation(reservationId)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpenDropdown(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  return (
    <>
      <AssignItemDialog
        open={openAssign}
        setOpen={setOpenAssign}
        reservationId={reservationId}
        setOpenConfirmApply={setOpenConfirmApply}
      />

      <ConfirmApplyLabelDialog
        assignedDate={assignedDate}
        expiryDate={expiryDate}
        fullName={fullName}
        reservationCode={reservationCode}
        cardBarcode={cardBarcode}
        open={openConfirmApply}
        setOpen={setOpenConfirmApply}
        reservationId={reservationId}
        reservationDate={reservationDate}
      />

      <DropdownMenu open={openDropdown} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="overflow-visible">
          {canAssign && (
            <DropdownMenuItem
              disabled={extending}
              className="cursor-pointer"
              onClick={() => {
                setOpenDropdown(false)
                setOpenAssign(true)
              }}
            >
              <Icons.Assign className="size-4" />
              {t("Assign item")}
            </DropdownMenuItem>
          )}
          {!canAssign && !isAppliedLabel && (
            <DropdownMenuItem
              disabled={extending}
              className="cursor-pointer"
              onClick={() => {
                setOpenDropdown(false)
                setOpenConfirmApply(true)
              }}
            >
              <Icons.Label className="size-4" />
              {t("Confirm apply label")}
            </DropdownMenuItem>
          )}
          {(status === EReservationQueueStatus.PENDING ||
            status === EReservationQueueStatus.ASSIGNED) &&
            reservationCode && (
              <DropdownMenuItem
                disabled={extending}
                className="cursor-pointer"
                onClick={handelExtend}
              >
                <Icons.Upgrade className="size-4" />
                {t("Extend pickup date")}
                {extending && <Loader2 className="ml-1 size-4 animate-spin" />}
              </DropdownMenuItem>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ReservationActionsDropdown
