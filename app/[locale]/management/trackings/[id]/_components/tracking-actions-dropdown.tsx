"use client"

import React, { useState, useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { Check, ChevronDown, ChevronUp, Pencil, Trash2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ETrackingStatus } from "@/lib/types/enums"
import { type Supplier, type Tracking } from "@/lib/types/models"
import { changeTrackingStatus } from "@/actions/trackings/change-tracking-status"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"

import DeleteTrackingDialog from "./delete-tracking-dialog"
import EditTrackingDialog from "./edit-tracking-dialog"

type Props = {
  tracking: Tracking & {
    supplier: Supplier
  }
}

function TrackingActionsDropdown({ tracking }: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { user } = useAuth()

  const handleChangeStatus = (status: ETrackingStatus) => {
    startTransition(async () => {
      const res = await changeTrackingStatus(tracking.trackingId, status)
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

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpenDropdown(value)
  }

  return (
    <>
      <EditTrackingDialog
        open={openEdit}
        setOpen={setOpenEdit}
        tracking={tracking}
      />

      <DeleteTrackingDialog
        title={tracking.receiptNumber}
        open={openDelete}
        setOpen={setOpenDelete}
        trackingId={tracking.trackingId}
      />

      <DropdownMenu open={openDropdown} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="overflow-visible">
          {/* ! TODO:hardcode */}
          {user?.role.englishName === "HeadLibrarian" && (
            <>
              {tracking.status === ETrackingStatus.DRAFT && (
                <>
                  <DropdownMenuItem
                    disabled={isPending}
                    className="cursor-pointer"
                    onClick={() =>
                      handleChangeStatus(ETrackingStatus.COMPLETED)
                    }
                  >
                    <Check />
                    {t("Completed")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isPending}
                    className="cursor-pointer"
                    onClick={() =>
                      handleChangeStatus(ETrackingStatus.CANCELLED)
                    }
                  >
                    <X />
                    {t("Cancelled")}
                  </DropdownMenuItem>
                </>
              )}

              {tracking.status === ETrackingStatus.COMPLETED && (
                <>
                  <DropdownMenuItem
                    disabled={isPending}
                    className="cursor-pointer"
                    onClick={() => handleChangeStatus(ETrackingStatus.DRAFT)}
                  >
                    <Icons.Draft />
                    {t("Chuyển sang bản nháp")}
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
          <DropdownMenuItem
            disabled={isPending}
            className="cursor-pointer"
            onClick={() => {
              setOpenDropdown(false)
              setOpenEdit(true)
            }}
          >
            <Pencil />
            {t("Edit information")}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            className="cursor-pointer"
            onClick={() => {
              setOpenDropdown(false)
              setOpenDelete(true)
            }}
          >
            <Trash2 />
            {t("Delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default TrackingActionsDropdown
