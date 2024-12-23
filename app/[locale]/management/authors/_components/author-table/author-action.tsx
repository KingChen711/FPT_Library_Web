"use client"

import { useState, useTransition } from "react"
import { EyeOff, MoreHorizontal, Trash, Trash2, User2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Author, type Employee } from "@/lib/types/models"
import { type TEmployeeDialogSchema } from "@/lib/validations/employee/employee-dialog"
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

// import AuthorDialogForm from "../author-dialog"

// import EmployeeDialogForm from "../employee-dialog"
// import EmployeeDeleteConfirm from "./employee-delete-confirm"
// import EmployeeSoftDeleteConfirm from "./employee-soft-delete-confirm"

type EmployeeActionProps = {
  author: Author
}

const parseNumber = (value: string | null, fallback: number): number => {
  const parsed = Number(value)
  return isNaN(parsed) ? fallback : parsed
}

const AuthorAction = ({ author }: EmployeeActionProps) => {
  const locale = useLocale()
  const tGeneralManagement = useTranslations("GeneralManagement")

  const [pendingChangeStatus, startChangeStatus] = useTransition()
  const [pendingUndoDelete, startUndoDelete] = useTransition()

  const [openDelete, setOpenDelete] = useState(false)
  const [openSoftDelete, setOpenSoftDelete] = useState(false)

  // const [updatingEmployee] = useState<TEmployeeDialogSchema>(() => ({
  //   employeeCode: author.employeeCode as string,
  //   email: author.email,
  //   firstName: author.firstName as string,
  //   lastName: author.lastName as string,
  //   dob: author.dob,
  //   phone: author.phone,
  //   address: author.address,
  //   gender: parseNumber(author.gender, 0),
  //   hireDate: author.hireDate as string,
  //   roleId: author.roleId,
  // }))

  if (!author) return null

  const handleDeactivate = () => {
    startChangeStatus(async () => {
      const res = await changeEmployeeStatus(author.authorId.toString())
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
      const res = await undoDeleteEmployee(author.authorId.toString())
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
      {/* <EmployeeDeleteConfirm
        employee={employee}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <EmployeeSoftDeleteConfirm
        employee={employee}
        openDelete={openSoftDelete}
        setOpenDelete={setOpenSoftDelete}
      /> */}
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
          {!author?.isDeleted ? (
            <>
              <DropdownMenuItem className="cursor-pointer" asChild>
                {/* <AuthorDialogForm
                  mode="update"
                  employee={updatingEmployee}
                  employeeId={employee.employeeId}
                /> */}
                Update
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

export default AuthorAction
