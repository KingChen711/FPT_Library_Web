"use client"

import { useState, useTransition } from "react"
import { type TEmployeeRole } from "@/queries/roles/get-employee-roles"
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
import EmployeeRoleChange from "./employee-role-change"
import EmployeeSoftDeleteConfirm from "./employee-soft-delete-confirm"
import MutateEmployeeDialog from "./mutate-employee-dialog"

type Props = {
  employee: Employee
  employeeRoles: TEmployeeRole[]
}

function EmployeeActionDropdown({ employee, employeeRoles }: Props) {
  const t = useTranslations("GeneralManagement")

  const locale = useLocale()
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openSoftDelete, setOpenSoftDelete] = useState(false)
  const [openRoleChange, setOpenRoleChange] = useState(false)

  const [pendingChangeStatus, startChangeStatus] = useTransition()
  const [pendingUndoDelete, startUndoDelete] = useTransition()

  const handleDeactivate = () => {
    startChangeStatus(async () => {
      const res = await changeEmployeeStatus(employee.employeeId)
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

  const handleUndoDelete = () => {
    startUndoDelete(async () => {
      const res = await undoDeleteEmployee(employee.employeeId)
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
      <MutateEmployeeDialog
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        type="update"
        employee={employee}
        employeeRoles={employeeRoles}
      />
      <EmployeeRoleChange
        open={openRoleChange}
        setOpen={setOpenRoleChange}
        employee={employee}
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
        <DropdownMenuContent align="end">
          {!employee?.isDeleted ? (
            <>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-x-2"
                  onClick={() => setOpenEdit(true)}
                >
                  <SquarePen className="size-4" />
                  {t("btn.update")}
                </DropdownMenuItem>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenRoleChange(true)}
                className="cursor-pointer"
              >
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
