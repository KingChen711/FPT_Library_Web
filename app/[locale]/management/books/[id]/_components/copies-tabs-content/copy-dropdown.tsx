"use client"

import React, { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowDown,
  ArrowUp,
  Eye,
  MoreHorizontalIcon,
  // Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EBookCopyStatus } from "@/lib/types/enums"
import { type LibraryItemInstance } from "@/lib/types/models"
import { deleteCopy } from "@/actions/books/editions/delete-copy"
import { editCopy } from "@/actions/books/editions/edit-copy"
import { markInstanceAsFound } from "@/actions/books/editions/mark-instance-as-found"
import { markInstanceAsLost } from "@/actions/books/editions/mark-instance-as-lost"
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
import { Icons } from "@/components/ui/icons"

import DeleteDialog from "../../../../_components/delete-dialog"
import MoveToTrashDialog from "../../../../_components/move-to-trash-dialog"
import ConditionHistoriesDialog from "./condition-histories-dialog"
import EditBarcodeDialog from "./edit-barcode-dialog"

type Props = {
  bookId: number
  copy: LibraryItemInstance
  prefix: string
}

//*using optimistic UI technique on change status

export const editBarcodeSchema = z.object({
  barcode: z.string().min(1, "min1"),
})

function CopyDropdown({ copy, bookId, prefix }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [openMoveTrash, setOpenMoveTrash] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openEditBarcode, setOpenEditBarcode] = useState(false)
  const [openConditionHistories, setOpenConditionHistories] = useState(false)

  const form = useForm<z.infer<typeof editBarcodeSchema>>({
    resolver: zodResolver(editBarcodeSchema),
    defaultValues: {
      barcode: copy.barcode.replace(prefix, ""),
    },
  })

  const handlePutOnShelf = () => {
    if (isPending) return

    setOpen(false)

    startTransition(async () => {
      const res = await editCopy({
        status: EBookCopyStatus.IN_SHELF,
        copyId: copy.libraryItemInstanceId,
        barcode: copy.barcode,
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
      const res = await editCopy({
        status: EBookCopyStatus.OUT_OF_SHELF,
        copyId: copy.libraryItemInstanceId,
        barcode: copy.barcode,
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
        copyId: copy.libraryItemInstanceId,
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
        copyId: copy.libraryItemInstanceId,
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
        copyId: copy.libraryItemInstanceId,
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

  const handleEditBarcode = (values: z.infer<typeof editBarcodeSchema>) => {
    if (isPending) return

    setOpen(false)

    startTransition(async () => {
      const res = await editCopy({
        bookId,
        copyId: copy.libraryItemInstanceId,
        barcode: prefix + values.barcode,
        status: copy.status,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpenEditBarcode(false)
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  const handleMarkAsLost = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await markInstanceAsLost({
        libraryItemInstanceId: copy.libraryItemInstanceId,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleMarkAsFound = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await markInstanceAsFound({
        libraryItemInstanceId: copy.libraryItemInstanceId,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  return (
    <>
      <ConditionHistoriesDialog
        open={openConditionHistories}
        setOpen={setOpenConditionHistories}
        histories={copy.libraryItemConditionHistories}
      />
      <EditBarcodeDialog
        handleEditBarcode={handleEditBarcode}
        isPending={isPending}
        open={openEditBarcode}
        setOpen={setOpenEditBarcode}
        form={form}
      />
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
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-2">
          <>
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => setOpenConditionHistories(true)}
              className="cursor-pointer"
            >
              <Eye />
              {t("View condition histories")}
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              disabled={isPending}
              onClick={() => setOpenEditBarcode(true)}
              className="cursor-pointer"
            >
              <Pencil />
              {t("Edit barcode")}
            </DropdownMenuItem> */}
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
                    disabled={isPending}
                    onClick={handlePutOnShelf}
                    className="cursor-pointer"
                  >
                    <ArrowUp />
                    {t("Put on shelf")}
                  </DropdownMenuItem>
                )}
                {copy.status === EBookCopyStatus.IN_SHELF && (
                  <DropdownMenuItem
                    disabled={isPending}
                    onClick={handleRemoveOnShelf}
                    className="cursor-pointer"
                  >
                    <ArrowDown />
                    {t("Remove on shelf")}
                  </DropdownMenuItem>
                )}
                {copy.status === EBookCopyStatus.LOST ? (
                  <DropdownMenuItem
                    disabled={isPending}
                    onClick={handleMarkAsFound}
                    className="cursor-pointer"
                  >
                    <Icons.LostAndFound />
                    {t("Mark as found")}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    disabled={isPending}
                    onClick={handleMarkAsLost}
                    className="cursor-pointer"
                  >
                    <Icons.LostAndFound />
                    {t("Mark as lost")}
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
