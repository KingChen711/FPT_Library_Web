"use client"

import { useState, useTransition } from "react"
import {
  EyeOff,
  MoreHorizontal,
  SquarePen,
  Trash,
  Trash2,
  User2,
} from "lucide-react"
import { useLocale } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Employee } from "@/lib/types/models"
import { type TEmployeeDialogSchema } from "@/lib/validations/employee/employee-dialog"
import { changeEmployeeStatus } from "@/actions/employees/change-status"
import { softDeleteEmployee } from "@/actions/employees/soft-delete"
import { undoDeleteEmployee } from "@/actions/employees/undo-delete"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import EmployeeDialogForm from "../employee-dialog"

type EmployeeActionProps = {
  employee: Employee
}

const parseNumber = (value: string | null, fallback: number): number => {
  const parsed = Number(value)
  return isNaN(parsed) ? fallback : parsed
}

const EmployeeAction = ({ employee }: EmployeeActionProps) => {
  const locale = useLocale()
  const [pendingChangeStatus, startChangeStatus] = useTransition()
  const [pendingSoftDelete, startSoftDelete] = useTransition()
  const [pendingUndoDelete, startUndoDelete] = useTransition()
  const [updatingEmployee] = useState<TEmployeeDialogSchema>(() => ({
    employeeCode: employee.employeeCode as string,
    email: employee.email,
    firstName: employee.firstName as string,
    lastName: employee.lastName as string,
    dob: employee.dob as string,
    phone: employee.phone as string,
    address: employee.address as string,
    gender: parseNumber(employee.gender, 0),
    hireDate: employee.hireDate as string,
    roleId: employee.roleId,
  }))

  if (!employee) return null

  const handleDeactive = () => {
    startChangeStatus(async () => {
      const res = await changeEmployeeStatus(employee.employeeId as string)
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

  const handleSoftDelete = () => {
    startSoftDelete(async () => {
      const res = await softDeleteEmployee(employee.employeeId as string)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Soft delete successfully",
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
      const res = await undoDeleteEmployee(employee.employeeId as string)
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
        <DropdownMenuItem className="cursor-pointer" asChild>
          <EmployeeDialogForm
            mode="edit"
            employee={updatingEmployee}
            employeeId={employee.employeeId as string}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <User2 /> Change role
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleDeactive}
          disabled={pendingChangeStatus}
        >
          <EyeOff /> De-activate user
        </DropdownMenuItem>

        {!employee?.isDeleted && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleSoftDelete}
            disabled={pendingSoftDelete}
          >
            <Trash /> Move to trash
          </DropdownMenuItem>
        )}

        {employee?.isDeleted && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleUndoDelete}
            disabled={pendingUndoDelete}
          >
            <Trash /> Undo delete
          </DropdownMenuItem>
        )}

        {employee?.isDeleted && (
          <DropdownMenuItem className="cursor-pointer">
            <Trash2 /> Delete permanently
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default EmployeeAction
