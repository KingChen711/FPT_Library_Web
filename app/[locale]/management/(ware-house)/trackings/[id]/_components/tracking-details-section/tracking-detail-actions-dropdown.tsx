"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
  type TrackingDetail,
} from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"

import ConfirmGlueDialog from "./confirm-glue-dialog"
import DeleteTrackingDetailDialog from "./delete-tracking-detail-dialog"
import EditTrackingDetailDialog from "./edit-tracking-detail-dialog"
import ViewLibraryItemDialog from "./view-library-item-dialog"

type Props = {
  trackingDetail: TrackingDetail & {
    libraryItem:
      | (BookEdition & {
          libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
          category: Category
        })
      | null
    category: Category
  }
  supplementRequest?: boolean
}

function TrackingDetailActionsDropdown({
  trackingDetail,
  supplementRequest = false,
}: Props) {
  const t = useTranslations("TrackingsManagementPage")

  const [openDropdown, setOpenDropdown] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const [openViewItem, setOpenViewItem] = useState(false)
  const [openConfirmGlue, setOpenConfirmGlue] = useState(false)

  return (
    <>
      {trackingDetail.libraryItemId && (
        <ViewLibraryItemDialog
          libraryItemId={trackingDetail.libraryItemId}
          open={openViewItem}
          setOpen={setOpenViewItem}
        />
      )}

      {trackingDetail.libraryItemId && (
        <ConfirmGlueDialog
          trackingId={trackingDetail.trackingId}
          trackingDetailId={trackingDetail.trackingDetailId}
          open={openConfirmGlue}
          setOpen={setOpenConfirmGlue}
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
          {trackingDetail.libraryItemId && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setOpenDropdown(false)
                setOpenViewItem(true)
              }}
            >
              <Eye className="size-4" />
              {t("View library item")}
            </DropdownMenuItem>
          )}

          {!trackingDetail.libraryItemId && !supplementRequest && (
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link
                href={`/management/books/create?trackingDetailId=${trackingDetail.trackingDetailId}`}
              >
                <Icons.Catalog className="size-4" />
                {t("Catalog")}
              </Link>
            </DropdownMenuItem>
          )}

          {!trackingDetail.hasGlueBarcode &&
            !supplementRequest &&
            trackingDetail.libraryItemId && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setOpenDropdown(false)
                  setOpenConfirmGlue(true)
                }}
              >
                <Icons.Glue className="size-4" />
                {t("Glue barcode")}
              </DropdownMenuItem>
            )}

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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default TrackingDetailActionsDropdown
