"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { type PatronDetail } from "@/queries/patrons/get-patron"
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { deletePatron } from "@/actions/library-card/patrons/delete-patron"
import { moveToTrashPatron } from "@/actions/library-card/patrons/move-to-trash-patron"
import { restorePatron } from "@/actions/library-card/patrons/restore-patron"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteDialog from "@/app/[locale]/management/_components/delete-dialog"
import MoveToTrashDialog from "@/app/[locale]/management/_components/move-to-trash-dialog"

import EditPatronDialog from "./edit-patron-dialog"

type Props = {
  patron: PatronDetail
}

function PatronActionsDropdown({ patron }: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const locale = useLocale()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openMoveTrash, setOpenMoveTrash] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleMoveToTrash = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await moveToTrashPatron(patron.userId)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })

        setOpenDropdown(false)
        setOpenMoveTrash(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleRestore = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await restorePatron(patron.userId)

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

  const handleDelete = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await deletePatron(patron.userId)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpenDropdown(false)
        setOpenDelete(false)
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
      <EditPatronDialog open={openEdit} setOpen={setOpenEdit} patron={patron} />

      <MoveToTrashDialog
        handleMoveToTrash={handleMoveToTrash}
        isPending={isPending}
        open={openMoveTrash}
        setOpen={setOpenMoveTrash}
      />
      <DeleteDialog
        handleDelete={handleDelete}
        isPending={isPending}
        open={openDelete}
        setOpen={setOpenDelete}
      />

      <DropdownMenu open={openDropdown} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="overflow-visible">
          {!patron.libraryCard && (
            <DropdownMenuItem
              disabled={isPending}
              className="cursor-pointer"
              asChild
            >
              <Link
                href={`/management/library-card-holders/${patron.userId}/add-card`}
              >
                <Plus /> {t("Create card")}
              </Link>
            </DropdownMenuItem>
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
          {patron.isDeleted ? (
            <>
              <DropdownMenuItem
                disabled={isPending}
                className="cursor-pointer"
                onClick={handleRestore}
              >
                <RotateCcw /> {t("Restore")}
                {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isPending}
                className="cursor-pointer"
                onClick={() => {
                  setOpenDropdown(false)
                  setOpenDelete(true)
                }}
              >
                <Trash2 /> {t("Delete permanently")}
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              disabled={isPending}
              className="cursor-pointer"
              onClick={() => {
                setOpenDropdown(false)
                setOpenMoveTrash(true)
              }}
            >
              <Trash2 /> {t("Move to trash")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default PatronActionsDropdown
