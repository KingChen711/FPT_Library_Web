"use client"

import { useState, useTransition } from "react"
import {
  EyeOff,
  MoreHorizontal,
  PencilIcon,
  SquarePen,
  Trash,
  Trash2,
  User2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Employee } from "@/lib/types/models"
import { changeEmployeeStatus } from "@/actions/employees/change-status"
import { undoDeleteEmployee } from "@/actions/employees/undo-delete"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import EmployeeDeleteConfirm from "./employee-delete-confirm"
import EmployeeSoftDeleteConfirm from "./employee-soft-delete-confirm"

type Props = {
  employee: Employee
}

function EmployeeActionDropdown({ employee }: Props) {
  const t = useTranslations("GeneralManagement")
  const locale = useLocale()
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openSoftDelete, setOpenSoftDelete] = useState(false)

  const [pendingChangeStatus, startChangeStatus] = useTransition()
  const [pendingUndoDelete, startUndoDelete] = useTransition()

  const handleDeactivate = () => {
    startChangeStatus(async () => {
      const res = await changeEmployeeStatus(employee.employeeId)
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
      const res = await undoDeleteEmployee(employee.employeeId)
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
      <EmployeeDeleteConfirm
        employee={employee}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <EmployeeSoftDeleteConfirm
        employee={employee}
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
          {!employee?.isDeleted ? (
            <>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <DropdownMenuItem className="cursor-pointer">
                  <div
                    onClick={() => setOpenEdit(true)}
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

export default EmployeeActionDropdown
