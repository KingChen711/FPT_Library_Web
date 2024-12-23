"use client"

import { useState, useTransition } from "react"
import { EyeOff, MoreHorizontal, Trash, Trash2, User2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type User } from "@/lib/types/models"
import { type TUserDialogSchema } from "@/lib/validations/auth/user-dialog"
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

import UserDialogForm from "../user-dialog"
import UserDeleteConfirm from "./user-delete-confirm"
import UserSoftDeleteConfirm from "./user-soft-delete-confirm"

type UserActionProps = {
  user: User
}

const parseNumber = (value: string | null, fallback: number): number => {
  const parsed = Number(value)
  return isNaN(parsed) ? fallback : parsed
}

const UserAction = ({ user }: UserActionProps) => {
  const locale = useLocale()
  const tGeneralManagement = useTranslations("GeneralManagement")

  const [pendingChangeStatus, startChangeStatus] = useTransition()
  const [pendingUndoDelete, startUndoDelete] = useTransition()

  const [openDelete, setOpenDelete] = useState(false)
  const [openSoftDelete, setOpenSoftDelete] = useState(false)

  const [updatingUser] = useState<TUserDialogSchema>(() => ({
    email: user.email,
    address: user.address,
    phone: user.phone,
    dob: user.dob,
    gender: parseNumber(user.gender, 0),
    firstName: user.firstName,
    lastName: user.lastName,
    userCode: user.userCode,
  }))

  if (!user) return null

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 w-full justify-center p-0"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-primary-foreground">
          {!user?.isDeleted ? (
            <>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <UserDialogForm
                  mode="update"
                  user={updatingUser}
                  userId={user.userId}
                />
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <User2 /> {tGeneralManagement("change role")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleDeactivate}
                disabled={pendingChangeStatus}
              >
                <EyeOff /> {tGeneralManagement("de-activate")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenSoftDelete(true)}
              >
                <Trash /> {tGeneralManagement("move to trash")}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleUndoDelete}
                disabled={pendingUndoDelete}
              >
                <Trash /> {tGeneralManagement("undo delete")}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenDelete(true)}
              >
                <Trash2 /> {tGeneralManagement("delete permanently")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UserAction
