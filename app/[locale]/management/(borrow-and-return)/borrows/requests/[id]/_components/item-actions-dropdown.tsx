"use client"

import React, { useState, useTransition } from "react"
import { Link } from "@/i18n/routing"
import { MoreHorizontal, Navigation, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cancelRequestItem } from "@/actions/borrows/cancel-request-item"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import CancelRequestItemDialog from "./cancel-request-item-dialog"

type Props = {
  requestId: number
  libraryItemId: number
  libraryCardId: string
  title: string
}

function ItemActionsDropdown({
  libraryCardId,
  libraryItemId,
  requestId,
  title,
}: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const [openCancel, setOpenCancel] = useState(false)
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpenCancel(value)
  }

  const handleCancel = () => {
    startTransition(async () => {
      const res = await cancelRequestItem(
        requestId,
        libraryItemId,
        libraryCardId
      )

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpenCancel(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  return (
    <Dialog open={openCancel} onOpenChange={handleOpenChange}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link
              target="_blank"
              href={`/management/books/${libraryItemId}`}
              className="flex items-center gap-2"
            >
              <Navigation className="size-4" />
              {t("View library item")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DialogTrigger className="cursor-pointer">
              <Trash2 className="size-4" />
              {t("Cancel request")}
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CancelRequestItemDialog
        isPending={isPending}
        onCancel={handleCancel}
        setOpen={setOpenCancel}
        title={title}
      />
    </Dialog>
  )
}

export default ItemActionsDropdown
