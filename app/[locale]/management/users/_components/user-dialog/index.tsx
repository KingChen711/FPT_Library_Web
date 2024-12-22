"use client"

import { useEffect, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, SquarePen } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  employeeDialogSchema,
  type TEmployeeDialogSchema,
} from "@/lib/validations/employee/employee-dialog"
import { createEmployee } from "@/actions/employees/create-employee"
import { updateEmployee } from "@/actions/employees/update-employee"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"

import EmployeeDialogGender from "./user-dialog-gender"
import EmployeeDialogInput from "./user-dialog-input"
import EmployeeDialogRole from "./user-dialog-role"

type EmployeeDialogFormProps = {
  mode: "create" | "update"
  employee?: TEmployeeDialogSchema
  employeeId?: string
}

const EmployeeDialogForm = ({
  mode,
  employee,
  employeeId,
}: EmployeeDialogFormProps) => {
  const locale = useLocale()
  const [pending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState<boolean>(false)
  const tEmployeeManagement = useTranslations("EmployeeManagement")
  const tGeneralManagement = useTranslations("GeneralManagement")

  const form = useForm<TEmployeeDialogSchema>({
    resolver: zodResolver(employeeDialogSchema),
    defaultValues: {
      employeeCode: employee?.employeeCode ?? "",
      email: employee?.email ?? "",
      firstName: employee?.firstName ?? "",
      lastName: employee?.lastName ?? "",
      dob: employee?.dob ?? "",
      phone: employee?.phone ?? "",
      address: employee?.address ?? "",
      gender: employee?.gender ?? -1,
      hireDate: employee?.hireDate ?? "",
      roleId: employee?.roleId ?? -1,
    },
  })

  useEffect(() => {
    form.reset()
    form.clearErrors()
  }, [form, isOpen])

  const onSubmit = async (values: TEmployeeDialogSchema) => {
    startTransition(async () => {
      const res =
        mode === "create"
          ? await createEmployee(values)
          : await updateEmployee(employeeId as string, values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          variant: "success",
        })
        setOpen(false)
        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  const handleCancel = () => {
    form.reset()
    form.clearErrors()
    setOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(state) => setOpen(state)}>
      {mode === "create" && (
        <DialogTrigger asChild>
          <Button>
            <Plus size={16} />
            {tEmployeeManagement("create employee")}
          </Button>
        </DialogTrigger>
      )}

      {mode === "update" && employee && (
        <DialogTrigger asChild>
          <div className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent">
            <SquarePen size={16} /> {tEmployeeManagement("update employee")}
          </div>
        </DialogTrigger>
      )}

      <DialogContent className="m-0 overflow-hidden p-0 pb-4">
        <DialogHeader className="w-full space-y-4 bg-primary p-4">
          <DialogTitle className="text-center text-primary-foreground">
            {mode === "create"
              ? tEmployeeManagement("create employee")
              : tEmployeeManagement("update employee")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="container h-[60vh] space-y-4 overflow-y-auto px-4"
          >
            <div className="space-y-2">
              <EmployeeDialogInput
                form={form}
                fieldName="employeeCode"
                pending={pending}
                formLabel={tGeneralManagement("fields.employeeCode")}
                inputPlaceholder={tGeneralManagement("placeholder.code")}
              />
              <EmployeeDialogInput
                form={form}
                fieldName="email"
                pending={pending}
                inputType="email"
                formLabel={tGeneralManagement("fields.email")}
                inputPlaceholder={tGeneralManagement("placeholder.email")}
              />
              <EmployeeDialogInput
                form={form}
                fieldName="firstName"
                pending={pending}
                formLabel={tGeneralManagement("fields.firstName")}
                inputPlaceholder={tGeneralManagement("placeholder.firstName")}
              />
              <EmployeeDialogInput
                form={form}
                fieldName="lastName"
                pending={pending}
                formLabel={tGeneralManagement("fields.lastName")}
                inputPlaceholder={tGeneralManagement("placeholder.lastName")}
              />
              <EmployeeDialogInput
                form={form}
                fieldName="phone"
                pending={pending}
                formLabel={tGeneralManagement("fields.phone")}
                inputPlaceholder={tGeneralManagement("placeholder.phone")}
              />
              <EmployeeDialogInput
                form={form}
                fieldName="address"
                pending={pending}
                formLabel={tGeneralManagement("fields.address")}
                inputPlaceholder={tGeneralManagement("placeholder.address")}
              />
              <EmployeeDialogInput
                form={form}
                fieldName="dob"
                pending={pending}
                inputType="date"
                formLabel={tGeneralManagement("fields.dob")}
                inputPlaceholder={tGeneralManagement("placeholder.dob")}
              />
              <EmployeeDialogInput
                form={form}
                fieldName="hireDate"
                pending={pending}
                inputType="date"
                formLabel={tGeneralManagement("fields.hireDate")}
                inputPlaceholder={tGeneralManagement("placeholder.hireDate")}
              />

              <EmployeeDialogGender
                form={form}
                fieldName="gender"
                pending={pending}
                formLabel={tGeneralManagement("fields.gender")}
                selectPlaceholder={tGeneralManagement("placeholder.gender")}
              />

              <EmployeeDialogRole
                form={form}
                fieldName="roleId"
                pending={pending}
                formLabel={tGeneralManagement("fields.role")}
                selectPlaceholder={tGeneralManagement("placeholder.role")}
              />
            </div>

            <div className="flex w-full items-center justify-end gap-4">
              <Button disabled={pending} type="submit">
                {tGeneralManagement("btn.save")}
                {pending && <Loader2 className="size-4 animate-spin" />}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={pending}
                variant={"ghost"}
              >
                {tGeneralManagement("btn.cancel")}
                {pending && <Loader2 className="size-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeDialogForm
