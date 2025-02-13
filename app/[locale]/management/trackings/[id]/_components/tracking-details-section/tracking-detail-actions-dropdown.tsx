"use client"

import React, { useState } from "react"
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { type TrackingDetail } from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import AddItemDialog from "./add-item-dialog"
import DeleteTrackingDetailDialog from "./delete-tracking-detail-dialog"
import EditTrackingDetailDialog from "./edit-tracking-detail-dialog"
import RemoveItemDialog from "./remove-item-dialog"

type Props = {
  trackingDetail: TrackingDetail
}

function TrackingDetailActionsDropdown({ trackingDetail }: Props) {
  const t = useTranslations("TrackingsManagementPage")

  const [openDropdown, setOpenDropdown] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openRemoveItem, setOpenRemoveItem] = useState(false)
  const [openAddItem, setOpenAddItem] = useState(false)

  return (
    <>
      {trackingDetail.libraryItemId ? (
        <RemoveItemDialog
          libraryItemId={trackingDetail.libraryItemId}
          open={openRemoveItem}
          setOpen={setOpenRemoveItem}
          trackingDetailId={trackingDetail.trackingDetailId}
          trackingId={trackingDetail.trackingId}
        />
      ) : (
        <AddItemDialog
          open={openAddItem}
          setOpen={setOpenAddItem}
          trackingDetailId={trackingDetail.trackingDetailId}
          trackingId={trackingDetail.trackingId}
        />
      )}

      <EditTrackingDetailDialog
        open={openEdit}
        setOpen={setOpenEdit}
        trackingDetail={trackingDetail}
      />

      <DeleteTrackingDetailDialog
        title={trackingDetail.itemName}
        open={openDelete}
        setOpen={setOpenDelete}
        trackingId={trackingDetail.trackingId}
        trackingDetailId={trackingDetail.trackingDetailId}
      />

      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="overflow-visible">
          <DropdownMenuItem
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
            className="cursor-pointer"
            onClick={() => {
              setOpenDropdown(false)
              setOpenDelete(true)
            }}
          >
            <Trash2 />
            {t("Delete")}
          </DropdownMenuItem>
          {trackingDetail.libraryItemId ? (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setOpenDropdown(false)
                setOpenRemoveItem(true)
              }}
            >
              <Trash2 className="size-4" />
              {t("Remove catalog")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setOpenDropdown(false)
                setOpenAddItem(true)
              }}
            >
              <Plus className="size-4" />
              {t("Add catalog")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default TrackingDetailActionsDropdown
