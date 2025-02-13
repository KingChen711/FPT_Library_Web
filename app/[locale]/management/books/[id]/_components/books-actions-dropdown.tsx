"use client"

import React, { useState, useTransition } from "react"
import { useManagementBookEditionsStore } from "@/stores/books/use-management-book-editions"
import { Brain, ChevronDown, ChevronUp, RotateCcw, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { deleteBooks } from "@/actions/books/delete-books"
import { moveToTrashBookEditions } from "@/actions/books/editions/move-to-trash-book-editions"
import { restoreEditions } from "@/actions/books/editions/restore-editions"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DeleteDialog from "./delete-dialog"
import MoveToTrashDialog from "./move-to-trash-dialog"

type Props = {
  tab: "Active" | "Deleted" | "Not trained"
}

function BooksActionsDropdown({ tab }: Props) {
  const { selectedIds, clear } = useManagementBookEditionsStore()
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openMoveTrash, setOpenMoveTrash] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpenDropdown(value)
  }

  const handleMoveToTrash = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await moveToTrashBookEditions(selectedIds)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        clear()
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
      const res = await restoreEditions(selectedIds)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        clear()
        setOpenDropdown(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleDelete = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await deleteBooks(selectedIds)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        clear()
        setOpenDropdown(false)
        setOpenDelete(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleTrain = () => {
    if (isPending) return

    startTransition(async () => {
      // const res = await deleteBooks(selectedIds)
      // if (res.isSuccess) {
      //   toast({
      //     title: locale === "vi" ? "Thành công" : "Success",
      //     description: res.data,
      //     variant: "success",
      //   })
      //   clear()
      //   setOpenDropdown(false)
      //   setOpenDelete(false)
      //   return
      // }
      // handleServerActionError(res, locale)
    })
  }

  if (selectedIds.length === 0) return null

  return (
    <>
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
        <DropdownMenuContent>
          {tab === "Not trained" && (
            <DropdownMenuItem
              disabled={isPending}
              onClick={handleTrain}
              className="cursor-pointer"
            >
              <Brain />
              Train AI
            </DropdownMenuItem>
          )}

          {tab !== "Deleted" ? (
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => setOpenMoveTrash(true)}
              className="cursor-pointer"
            >
              <Trash2 />
              {t("Move to trash")}
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem
                disabled={isPending}
                onClick={handleRestore}
                className="cursor-pointer"
              >
                <RotateCcw />
                {t("Restore")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => {
                  setOpenDelete(true)
                }}
                className="cursor-pointer"
              >
                <Trash2 />
                {t("Delete permanently")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default BooksActionsDropdown
