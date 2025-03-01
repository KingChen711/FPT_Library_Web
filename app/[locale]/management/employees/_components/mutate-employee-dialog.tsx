"use client"

import { useState, useTransition } from "react"
import { type TEmployeeRole } from "@/queries/roles/get-employee-roles"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Employee } from "@/lib/types/models"
import { formatDateInput } from "@/lib/utils"
import {
  mutateEmployeeSchema,
  type TMutateEmployeeSchema,
} from "@/lib/validations/employee/mutate-employee"
import { createEmployee } from "@/actions/employees/create-employee"
import { updateEmployee } from "@/actions/employees/update-employee"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  type: "create" | "update"
  employee?: Employee
  openEdit?: boolean
  setOpenEdit?: (value: boolean) => void
} & (
  | {
      type: "create"
      employeeRoles: TEmployeeRole[]
    }
  | {
      type: "update"
      employee: Employee
      openEdit: boolean
      setOpenEdit: (value: boolean) => void
      employeeRoles: TEmployeeRole[]
    }
)

function MutateEmployeeDialog({
  type,
  employee,
  openEdit,
  setOpenEdit,
  employeeRoles,
}: Props) {
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("GeneralManagement")
  const tEmployeeManagement = useTranslations("EmployeeManagement")
  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    if (type === "create") {
      setOpen(value)
      return
    }
    setOpenEdit(value)
  }

  const form = useForm<TMutateEmployeeSchema>({
    resolver: zodResolver(mutateEmployeeSchema),
    defaultValues: {
      employeeCode: type === "update" ? employee.employeeCode : null,
      email: type === "update" ? employee.email : "",
      roleId: type === "update" ? employee.role.roleId : 0,
      firstName: type === "update" ? employee.firstName : "",
      lastName: type === "update" ? employee.lastName : "",
      phone: type === "update" ? employee.phone : "",
      address: type === "update" ? employee.address : "",
      gender: type === "update" ? employee.gender : "Male",
      dob: type === "update" ? formatDateInput(employee.dob) : "",
      hireDate: type === "update" ? formatDateInput(employee.hireDate) : "",
      terminationDate:
        type === "update" ? formatDateInput(employee.terminationDate) : "",
    },
  })

  if (employeeRoles.length === 0)
    return <Loader2 className="size-8 animate-spin" />

  const onSubmit = async (values: TMutateEmployeeSchema) => {
    startTransition(async () => {
      if (type === "create") {
        const res = await createEmployee(values)
        if (res.isSuccess) {
          form.reset()
          setOpen(false)
          toast({
            title: "Create employee successfully",
            variant: "success",
          })
        } else {
          handleServerActionError(res, locale, form)
        }
      }

      if (type === "update") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, roleId, ...rest } = values
        const res = await updateEmployee(employee.employeeId, rest)
        if (res.isSuccess) {
          form.reset()
          setOpenEdit(false)
          toast({
            title: "Update employee successfully",
            variant: "success",
          })
        } else {
          handleServerActionError(res, locale, form)
        }
      }
    })
  }

  return (
    <Dialog
      open={type === "create" ? open : openEdit}
      onOpenChange={handleOpenChange}
    >
      {type === "create" && (
        <DialogTrigger asChild>
          <Button className="flex items-center justify-end gap-x-1 leading-none">
            <Plus />
            <div>{tEmployeeManagement("create employee")}</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tEmployeeManagement(
              type === "create" ? "create employee" : "update employee"
            )}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.employeeCode")}</FormLabel>

                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          value={field.value ?? ""}
                          placeholder={t("placeholder.code")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          disabled={isPending || type === "update"}
                          {...field}
                          placeholder={t("placeholder.email")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.role")}</FormLabel>
                      <Select
                        disabled={isPending || type === "update"}
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("placeholder.role")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employeeRoles.map((role) => (
                            <SelectItem
                              key={role.roleId}
                              value={role.roleId.toString()}
                            >
                              {locale === "en"
                                ? role.englishName
                                : role.vietnameseName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.gender")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("placeholder.gender")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">
                            {t("fields.male")}
                          </SelectItem>
                          <SelectItem value="Female">
                            {t("fields.female")}
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.firstName")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("placeholder.firstName")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.lastName")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("placeholder.lastName")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.dob")}</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.phone")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder={t("placeholder.phone")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.address")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder={t("placeholder.address")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hireDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.hireDate")}</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terminationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.terminationDate")}</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button
                      disabled={isPending}
                      variant="secondary"
                      className="float-right mt-4"
                    >
                      {t("btn.cancel")}
                    </Button>
                  </DialogClose>

                  <Button
                    disabled={isPending}
                    type="submit"
                    className="float-right mt-4"
                  >
                    {t(type === "create" ? "btn.create" : "btn.save")}
                    {isPending && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default MutateEmployeeDialog
