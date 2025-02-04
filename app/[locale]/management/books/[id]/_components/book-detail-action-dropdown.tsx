"use client"

import React, { useState, useTransition } from "react"
import { type BookDetail } from "@/queries/books/get-book"
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EBookEditionStatus } from "@/lib/types/enums"
import { publishEdition } from "@/actions/books/editions/publish-edition"
import { restoreEdition } from "@/actions/books/editions/restore-edition"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"

import DeleteBookDialog from "./delete-book-dialog"
import EditBookDialog from "./edit-book-dialog"
import EditShelfDialog from "./edit-shelf-dialog"
import SoftDeleteBookDialog from "./soft-delete-book-dialog"

type Props = {
  book: BookDetail
}

function BookDetailActionDropdown({ book }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openEditShelf, setOpenEditShelf] = useState(false)
  const [openSoftDelete, setOpenSoftDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handlePublishEdition = () => {
    startTransition(async () => {
      const res = await publishEdition(book.libraryItemId)
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

  const handleRestoreEdition = () => {
    startTransition(async () => {
      const res = await restoreEdition(book.libraryItemId)
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
      <EditBookDialog open={openEdit} setOpen={setOpenEdit} book={book} />

      <EditShelfDialog
        open={openEditShelf}
        setOpen={setOpenEditShelf}
        bookId={book.libraryItemId}
        initShelfId={book.shelfId}
        initShelfName={book.shelf?.shelfNumber}
      />

      <DeleteBookDialog
        title={book.title}
        open={openDelete}
        setOpen={setOpenDelete}
        bookId={book.libraryItemId}
      />

      <SoftDeleteBookDialog
        open={openSoftDelete}
        setOpen={setOpenSoftDelete}
        bookId={book.libraryItemId}
      />

      <DropdownMenu open={openDropdown} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="overflow-visible">
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
              setOpenEditShelf(true)
            }}
          >
            <Pencil />
            {t("Edit shelf")}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            className="cursor-pointer"
            onClick={handlePublishEdition}
          >
            {book.status === EBookEditionStatus.DRAFT ? (
              <Icons.Publish className="size-4" />
            ) : (
              <Icons.Draft className="size-4" />
            )}
            {t(
              book.status === EBookEditionStatus.DRAFT
                ? "Publish edition"
                : "Change to draft"
            )}

            {isPending && <Loader2 className="ml-1 animate-spin" />}
          </DropdownMenuItem>

          {book.status === EBookEditionStatus.DRAFT &&
            (book.isDeleted ? (
              <>
                <DropdownMenuItem
                  disabled={isPending}
                  className="cursor-pointer"
                  onClick={handleRestoreEdition}
                >
                  <RotateCcw /> {t("Restore")}{" "}
                  {isPending && <Loader2 className="ml-1 animate-spin" />}
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
                  setOpenSoftDelete(true)
                }}
              >
                <Trash2 /> {t("Move to trash")}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default BookDetailActionDropdown
