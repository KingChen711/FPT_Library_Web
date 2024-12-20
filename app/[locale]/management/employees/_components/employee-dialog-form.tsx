"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  employeeDialogSchema,
  type TEmployeeDialogSchema,
} from "@/lib/validations/employee/employee-dialog"
import { createEmployee } from "@/actions/employees/create-employee"
import useEmployeeRoles from "@/hooks/employees/use-employee-roles"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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

type EmployeeDialogFormProps = {
  mode: "create" | "edit"
}

const EmployeeDialogForm = ({ mode }: EmployeeDialogFormProps) => {
  const locale = useLocale()
  const [pending, startTransition] = useTransition()
  const EmployeeDialog = useTranslations("UserManagement.EmployeeDialog")
  const tUserManagement = useTranslations("UserManagement")
  const [isOpen, setOpen] = useState<boolean>(false)

  const { data: employeeRolesData, isLoading } = useEmployeeRoles()

  const form = useForm<TEmployeeDialogSchema>({
    resolver: zodResolver(employeeDialogSchema),
    defaultValues: {
      employeeCode: "",
      email: "",
      firstName: "",
      lastName: "",
      dob: "",
      phone: "",
      address: "",
      gender: -1,
      hireDate: "",
      roleId: 0,
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  const onSubmit = async (values: TEmployeeDialogSchema) => {
    startTransition(async () => {
      const res = await createEmployee(values)

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
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <Button asChild>
        <DialogTrigger>
          <Plus size={16} />
          {mode === "create"
            ? EmployeeDialog("addUser")
            : EmployeeDialog("editUser")}
        </DialogTrigger>
      </Button>
      <DialogContent className="m-0 overflow-hidden p-0 pb-4">
        <DialogHeader className="w-full space-y-4 bg-primary p-4">
          <DialogTitle className="text-center text-primary-foreground">
            {mode === "create"
              ? EmployeeDialog("addUser")
              : EmployeeDialog("editUser")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="container h-[60vh] space-y-4 overflow-y-auto px-4"
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="employeeCode"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        Employee Code
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          disabled={pending}
                          placeholder="Enter Employee Code"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        Email
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          type="email"
                          disabled={pending}
                          placeholder="Enter email"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        {tUserManagement("firstName")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          disabled={pending}
                          {...field}
                          placeholder="Enter first name"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        {tUserManagement("lastName")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          disabled={pending}
                          {...field}
                          placeholder="Enter last name"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        {tUserManagement("dob")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          type="date"
                          disabled={pending}
                          {...field}
                          placeholder="Enter date of birth"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        {tUserManagement("phone")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          disabled={pending}
                          {...field}
                          placeholder="Enter phone number"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        Address
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          disabled={pending}
                          {...field}
                          placeholder="Enter address"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        Gender
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Select
                          {...field}
                          value={String(field.value)}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Male</SelectItem>
                            <SelectItem value="1">Female</SelectItem>
                            <SelectItem value="2">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hireDate"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between gap-8">
                      <FormLabel className="flex w-1/4 items-center text-nowrap">
                        Hire Date
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          type="date"
                          disabled={pending}
                          {...field}
                          placeholder="Enter hiring date"
                          className="m-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col justify-between">
                      <div className="flex w-full justify-between gap-8">
                        <FormLabel className="flex w-1/4 items-center text-nowrap">
                          Role
                        </FormLabel>
                        <FormControl className="flex-1">
                          <Select
                            {...field}
                            value={String(field.value)}
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              {employeeRolesData?.map((role) => (
                                <SelectItem
                                  key={role.roleId}
                                  value={role.roleId.toString()}
                                >
                                  {locale === "vi"
                                    ? role.vietnameseName
                                    : role.englishName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex w-full items-center justify-end gap-4">
              <Button disabled={pending} type="submit">
                {EmployeeDialog("saveBtn")}
                {pending && <Loader2 className="size-4 animate-spin" />}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={pending}
                variant={"ghost"}
              >
                {EmployeeDialog("cancelBtn")}
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
