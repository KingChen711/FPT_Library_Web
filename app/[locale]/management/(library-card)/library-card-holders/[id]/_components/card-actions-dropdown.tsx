"use client"

import React, { useState, useTransition } from "react"
import { Link } from "@/i18n/routing"
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ECardStatus } from "@/lib/types/enums"
import { type LibraryCard } from "@/lib/types/models"
import { confirmCard } from "@/actions/library-card/cards/confirm-card"
import { deleteCard } from "@/actions/library-card/cards/delete-card"
import { unSuspendCard } from "@/actions/library-card/cards/un-suspend-card"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"
import DeleteDialog from "@/app/[locale]/management/_components/delete-dialog"

import ArchiveCardDialog from "./archive-card-dialog"
import EditCardDialog from "./edit-card-dialog"
import ExtendCardBorrowAmountDialog from "./extend-card-borrow-amount"
import RejectCardDialog from "./reject-card-dialog"
import SuspendCardDialog from "./suspend-card-dialog"

type Props = {
  libraryCard: LibraryCard
  userId: string
  canExtendCard: boolean
}

function LibraryCardActionsDropdown({
  libraryCard,
  userId,
  canExtendCard,
}: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const locale = useLocale()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openArchive, setOpenArchive] = useState(false)
  const [openReject, setOpenReject] = useState(false)
  const [openSuspend, setOpenSuspend] = useState(false)
  const [openExtendBorrow, setOpenExtendBorrow] = useState(false)

  const [confirming, startConfirm] = useTransition()
  const [unSuspending, startUnSuspend] = useTransition()

  const handleConfirmCard = () => {
    if (confirming) return

    startConfirm(async () => {
      const res = await confirmCard(libraryCard.libraryCardId, userId)
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
    if (confirming) return

    startConfirm(async () => {
      const res = await deleteCard(libraryCard.libraryCardId, userId)
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

  const handleUnSuspendCard = () => {
    if (unSuspending) return

    startUnSuspend(async () => {
      const res = await unSuspendCard(libraryCard.libraryCardId, userId)
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
    if (confirming) return
    setOpenDropdown(value)
  }

  return (
    <>
      <DeleteDialog
        handleDelete={handleDelete}
        isPending={confirming || unSuspending}
        open={openDelete}
        setOpen={setOpenDelete}
      />

      <EditCardDialog
        userId={userId}
        isPending={confirming || unSuspending}
        setOpen={setOpenEdit}
        open={openEdit}
        card={libraryCard}
      />

      <ExtendCardBorrowAmountDialog
        libraryCardId={libraryCard.libraryCardId}
        userId={userId}
        open={openExtendBorrow}
        setOpen={setOpenExtendBorrow}
      />

      <ArchiveCardDialog
        libraryCardId={libraryCard.libraryCardId}
        userId={userId}
        open={openArchive}
        setOpen={setOpenArchive}
      />

      <RejectCardDialog
        libraryCardId={libraryCard.libraryCardId}
        userId={userId}
        open={openReject}
        setOpen={setOpenReject}
      />

      <SuspendCardDialog
        libraryCardId={libraryCard.libraryCardId}
        userId={userId}
        open={openSuspend}
        setOpen={setOpenSuspend}
      />

      <DropdownMenu open={openDropdown} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="overflow-visible">
          <DropdownMenuItem
            disabled={confirming || unSuspending}
            className="cursor-pointer"
            onClick={() => {
              setOpenDropdown(false)
              setOpenEdit(true)
            }}
          >
            <Pencil />
            {t("Edit information")}
          </DropdownMenuItem>

          {libraryCard.status === ECardStatus.PENDING && (
            <DropdownMenuItem
              disabled={confirming || unSuspending}
              className="cursor-pointer"
              onClick={handleConfirmCard}
            >
              <Icons.ConfirmCard className="size-4" />
              {t("Confirm card")}
              {confirming && <Loader2 className="ml-1 size-4 animate-spin" />}
            </DropdownMenuItem>
          )}

          {libraryCard.status === ECardStatus.PENDING && (
            <DropdownMenuItem
              disabled={confirming || unSuspending}
              className="cursor-pointer"
              onClick={() => {
                setOpenDropdown(false)
                setOpenReject(true)
              }}
            >
              <X className="size-5" />
              {t("Reject card")}
            </DropdownMenuItem>
          )}

          {libraryCard.status === ECardStatus.EXPIRED && canExtendCard && (
            <DropdownMenuItem
              disabled={confirming || unSuspending}
              className="cursor-pointer"
              asChild
            >
              <Link
                href={`/management/library-card-holders/${userId}/extend-card?libraryCardId=${libraryCard.libraryCardId}`}
              >
                <Plus /> {t("Extend card")}
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            disabled={confirming || unSuspending}
            className="cursor-pointer"
            onClick={() => {
              setOpenDropdown(false)
              setOpenArchive(true)
            }}
          >
            <Icons.Archive className="size-4" />
            {t("Archive card")}
          </DropdownMenuItem>

          {libraryCard.status === ECardStatus.ACTIVE && (
            <DropdownMenuItem
              disabled={confirming || unSuspending}
              className="cursor-pointer"
              onClick={() => {
                setOpenDropdown(false)
                setOpenExtendBorrow(true)
              }}
            >
              <Icons.Upgrade className="size-4" />
              {t("Extend borrow amount")}
            </DropdownMenuItem>
          )}

          {libraryCard.status !== ECardStatus.UNPAID &&
            libraryCard.status !== ECardStatus.PENDING &&
            libraryCard.status !== ECardStatus.REJECTED && (
              <DropdownMenuItem
                disabled={confirming || unSuspending}
                className="cursor-pointer"
                onClick={() => {
                  setOpenDropdown(false)
                  setOpenSuspend(true)
                }}
              >
                <Icons.Suspend className="size-4" />
                {t("Suspend card")}
              </DropdownMenuItem>
            )}

          {libraryCard.status === ECardStatus.SUSPENDED && (
            <DropdownMenuItem
              disabled={confirming || unSuspending}
              className="cursor-pointer"
              onClick={handleUnSuspendCard}
            >
              <Icons.UnSuspend className="size-4" />
              {t("Un suspend card")}
              {unSuspending && <Loader2 className="ml-1 size-4 animate-spin" />}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            disabled={confirming || unSuspending}
            className="cursor-pointer"
            onClick={() => {
              setOpenDropdown(false)
              setOpenDelete(true)
            }}
          >
            <Trash2 className="size-4" />
            {t("Delete card")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default LibraryCardActionsDropdown
