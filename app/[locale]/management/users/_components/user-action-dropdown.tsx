"use client"

import { useState, useTransition } from "react"
import { type TUserRole } from "@/queries/users/get-user-roles"
import {
  EyeOff,
  MoreHorizontal,
  SquarePen,
  Trash,
  Trash2,
  User2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type User } from "@/lib/types/models"
import { changeUserStatus } from "@/actions/users/change-status"
import { undoDeleteUser } from "@/actions/users/undo-delete"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import MutateUserDialog from "./mutate-user-dialog"
import UserDeleteConfirm from "./user-delete-confirm"
import UserSoftDeleteConfirm from "./user-soft-delete-confirm"

type Props = {
  user: User
  userRoles: TUserRole[]
}

function UserActionDropdown({ user }: Props) {
  const t = useTranslations("GeneralManagement")

  const locale = useLocale()
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openSoftDelete, setOpenSoftDelete] = useState(false)

  const [pendingChangeStatus, startChangeStatus] = useTransition()
  const [pendingUndoDelete, startUndoDelete] = useTransition()

  const handleDeactivate = () => {
    startChangeStatus(async () => {
      const res = await changeUserStatus(user.userId)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Change status success",
          description: res.data,
          variant: "success",
        })
        return
      }
      handleServerActionError(res, locale)
    })
  }

  const handleUndoDelete = () => {
    startUndoDelete(async () => {
      const res = await undoDeleteUser(user.userId)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Undo delete successfully",
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
      <UserDeleteConfirm
        user={user}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <UserSoftDeleteConfirm
        user={user}
        openDelete={openSoftDelete}
        setOpenDelete={setOpenSoftDelete}
      />
      <MutateUserDialog
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        type="update"
        user={user}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 w-full justify-center p-0"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="">
          {!user?.isDeleted ? (
            <>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <DropdownMenuItem className="cursor-pointer">
                  <div
                    onClick={() => {
                      setOpenEdit(true)
                    }}
                    className="flex items-center gap-x-2"
                  >
                    <SquarePen className="size-4" />
                    {t("btn.update")}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <User2 /> {t("change role")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleDeactivate}
                disabled={pendingChangeStatus}
              >
                <EyeOff /> {t("de-activate")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenSoftDelete(true)}
              >
                <Trash /> {t("move to trash")}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleUndoDelete}
                disabled={pendingUndoDelete}
              >
                <Trash /> {t("undo delete")}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenDelete(true)}
              >
                <Trash2 /> {t("delete permanently")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UserActionDropdown
