"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import {
  MoreHorizontalIcon,
  Navigation,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { z } from "zod"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type BookResource } from "@/lib/types/models"
import { deleteResource } from "@/actions/books/editions/delete-resource"
import { moveToTrashResource } from "@/actions/books/editions/move-to-trash-resource"
import { restoreResource } from "@/actions/books/editions/restore-resource"
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
import UpdateResourceDialog from "./update-resource-dialog"

type Props = {
  bookId: number
  resource: BookResource
}

//*using optimistic UI technique on change status

export const editBarcodeSchema = z.object({
  barcode: z.string().min(1, "min1"),
})

function ResourceActionsDropdown({ resource, bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [openMoveTrash, setOpenMoveTrash] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  // const form = useForm<z.infer<typeof editBarcodeSchema>>({
  //   resolver: zodResolver(editBarcodeSchema),
  //   defaultValues: {
  //     barcode: resource.barcode.replace(prefix, ""),
  //   },
  // })

  const handleMoveToTrash = () => {
    if (isPending) return

    setOpen(false)

    startTransition(async () => {
      const res = await moveToTrashResource({
        resourceId: resource.resourceId,
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
      const res = await restoreResource({
        resourceId: resource.resourceId,
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
      const res = await deleteResource({
        resourceId: resource.resourceId,
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
      <UpdateResourceDialog
        open={openEdit}
        setOpen={setOpenEdit}
        resource={resource}
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
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-2">
          <>
            <Link
              href={resource.resourceUrl}
              target="_blank"
              className="flex items-center"
            >
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => setOpenEdit(true)}
                className="cursor-pointer"
              >
                <Navigation />
                {t("View resource")}
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => setOpenEdit(true)}
              className="cursor-pointer"
            >
              <Pencil />
              {t("Update resource")}
            </DropdownMenuItem>
            {resource.isDeleted ? (
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

export default ResourceActionsDropdown
