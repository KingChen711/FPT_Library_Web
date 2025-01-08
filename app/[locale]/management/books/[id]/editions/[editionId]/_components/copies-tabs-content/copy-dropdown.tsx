"use client"

import React, { useState, useTransition } from "react"
import {
  ArrowDown,
  ArrowUp,
  MoreHorizontalIcon,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EBookCopyStatus } from "@/lib/types/enums"
import { type BookEditionCopy } from "@/lib/types/models"
import { changeCopyStatus } from "@/actions/books/editions/change-copy-status"
import { deleteCopy } from "@/actions/books/editions/delete-copy"
import { moveToTrashCopy } from "@/actions/books/editions/move-to-trash-copy"
import { restoreCopy } from "@/actions/books/editions/restore-copy"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DeleteDialog from "../../../../_components/delete-dialog"
import MoveToTrashDialog from "../../../../_components/move-to-trash-dialog"

type Props = {
  bookId: number
  copy: BookEditionCopy
}

//*using optimistic UI technique on change status

function CopyDropdown({ copy, bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [openMoveTrash, setOpenMoveTrash] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handlePutOnShelf = () => {
    if (isPending) return

    setOpen(false)

    startTransition(async () => {
      const res = await changeCopyStatus({
        status: EBookCopyStatus.IN_SHELF,
        copyId: copy.bookEditionCopyId,
        editionId: copy.bookEditionId,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleRemoveOnShelf = () => {
    if (isPending) return

    setOpen(false)

    startTransition(async () => {
      const res = await changeCopyStatus({
        status: EBookCopyStatus.OUT_OF_SHELF,
        copyId: copy.bookEditionCopyId,
        editionId: copy.bookEditionId,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleMoveToTrash = () => {
    if (isPending) return

    setOpen(false)

    startTransition(async () => {
      const res = await moveToTrashCopy({
        copyId: copy.bookEditionCopyId,
        editionId: copy.bookEditionId,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleRestore = () => {
    if (isPending) return

    setOpen(false)

    startTransition(async () => {
      const res = await restoreCopy({
        copyId: copy.bookEditionCopyId,
        editionId: copy.bookEditionId,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleDeletePermanently = () => {
    if (isPending) return

    setOpen(false)

    startTransition(async () => {
      const res = await deleteCopy({
        copyId: copy.bookEditionCopyId,
        editionId: copy.bookEditionId,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        return
      }

      handleServerActionError(res, locale)
    })
  }

  return (
    <>
      <MoveToTrashDialog
        handleMoveToTrash={handleMoveToTrash}
        isPending={isPending}
        open={openMoveTrash}
        setOpen={setOpenMoveTrash}
      />
      <DeleteDialog
        handleDelete={handleDeletePermanently}
        isPending={isPending}
        open={openDelete}
        setOpen={setOpenDelete}
      />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-2">
          <>
            {copy.isDeleted ? (
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
                  onClick={() => setOpenDelete(true)}
                  className="cursor-pointer"
                >
                  <Trash2 />
                  {t("Delete permanently")}
                </DropdownMenuItem>
              </>
            ) : (
              <>
                {copy.status === EBookCopyStatus.OUT_OF_SHELF && (
                  <DropdownMenuItem
                    onClick={handlePutOnShelf}
                    className="cursor-pointer"
                  >
                    <ArrowUp />
                    {t("Put on shelf")}
                  </DropdownMenuItem>
                )}
                {copy.status === EBookCopyStatus.IN_SHELF && (
                  <DropdownMenuItem
                    onClick={handleRemoveOnShelf}
                    className="cursor-pointer"
                  >
                    <ArrowDown />
                    {t("Remove on shelf")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  disabled={isPending}
                  onClick={() => setOpenMoveTrash(true)}
                  className="cursor-pointer"
                >
                  <Trash2 />
                  {t("Move to trash")}
                </DropdownMenuItem>
              </>
            )}
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CopyDropdown
