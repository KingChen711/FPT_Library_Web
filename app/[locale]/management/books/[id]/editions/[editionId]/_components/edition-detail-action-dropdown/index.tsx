"use client"

import React, { useState, useTransition } from "react"
import { type BookEditionDetail } from "@/queries/books/get-book-edition"
import { ChevronDown, ChevronUp, Pencil, RotateCcw, Trash2 } from "lucide-react"
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

import DeleteEditionDialog from "./delete-edition-dialog"
import SoftDeleteEditionDialog from "./soft-delete-edition-dialog"
import UpdateEditionDialog from "./update-edition-dialog"

type Props = {
  edition: BookEditionDetail
}

function EditionDetailActionDropdown({ edition }: Props) {
  const t = useTranslations("BooksManagementPage")
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openSoftDelete, setOpenSoftDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpenDropdown(value)
  }

  const handleRestoreEdition = () => {
    startTransition(async () => {
      const res = await restoreEdition(edition.bookId, edition.bookEditionId)
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

  const handlePublishEdition = () => {
    startTransition(async () => {
      const res = await publishEdition(edition.bookId, edition.bookEditionId)
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
      <UpdateEditionDialog
        open={openEdit}
        setOpen={setOpenEdit}
        edition={edition}
      />

      <DeleteEditionDialog
        open={openDelete}
        setOpen={setOpenDelete}
        bookId={edition.bookId}
        editionId={edition.bookEditionId}
        title={edition.editionTitle}
      />

      <SoftDeleteEditionDialog
        open={openSoftDelete}
        setOpen={setOpenSoftDelete}
        bookId={edition.bookId}
        editionId={edition.bookEditionId}
      />

      <DropdownMenu open={openDropdown} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
            onClick={handlePublishEdition}
          >
            {edition.status === EBookEditionStatus.DRAFT ? (
              <Icons.Publish className="size-4" />
            ) : (
              <Icons.Draft className="size-4" />
            )}
            {t(
              edition.status === EBookEditionStatus.DRAFT
                ? "Publish edition"
                : "Change to draft"
            )}
          </DropdownMenuItem>

          {edition.isDeleted ? (
            <>
              <DropdownMenuItem
                disabled={isPending}
                className="cursor-pointer"
                onClick={handleRestoreEdition}
              >
                <RotateCcw /> {t("Restore")}
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
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default EditionDetailActionDropdown
