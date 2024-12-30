"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-provider"
import { type TEmployeeRole } from "@/queries/roles/get-employee-roles"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Loader2, Plus, Trash } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ResourceType } from "@/lib/types/enums"
import { type Employee } from "@/lib/types/models"
import { cn } from "@/lib/utils"
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
import { Icons } from "@/components/ui/icons"
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

type TUploadImageData = {
  resultCode: string
  message: string
  data: {
    secureUrl: string
    publicId: string
  }
}

function MutateEmployeeDialog({
  type,
  employee,
  openEdit,
  setOpenEdit,
  employeeRoles,
}: Props) {
  const { accessToken } = useAuth()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [avatar, setAvatar] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
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
      employeeCode: type === "update" ? employee.employeeCode : "",
      email: type === "update" ? employee.email : "",
      roleId: type === "update" ? employee.roleId : 0,

      firstName: type === "update" ? employee.firstName : "",
      lastName: type === "update" ? employee.lastName : "",
      phone: type === "update" ? employee.phone : "",
      address: type === "update" ? employee.address : "",
      gender: type === "update" ? employee.gender : "Male",
      avatar: type === "update" ? employee.avatar : "",
      dob:
        type === "update"
          ? format(new Date(employee.dob), "yyyy-MM-dd")
          : "2025-07-07",
      hireDate:
        type === "update"
          ? format(new Date(employee.hireDate), "yyyy-MM-dd")
          : "2023-10-10",
      terminationDate:
        type === "update"
          ? format(new Date(employee.terminationDate), "yyyy-MM-dd")
          : "2025-07-07",
    },
  })

  if (employeeRoles.length === 0)
    return <Loader2 className="size-8 animate-spin" />

  const handleUploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("resourceType", ResourceType.Profile)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/management/resources/images/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    )
    const data = (await res.json()) as TUploadImageData
    setAvatar(data.data.secureUrl)

    // if (data.resultCode === "Cloud.Success0001") {
    //   toast({
    //     title: data.message,
    //     variant: "success",
    //   })
    //   setAvatar(data.data.secureUrl)
    // } else {
    //   toast({
    //     title: data.message,
    //     variant: "danger",
    //   })
    // }
  }

  const onSubmit = async (values: TMutateEmployeeSchema) => {
    if (!file) {
      toast({
        title: "Please upload image",
        variant: "danger",
      })
      return
    }

    startTransition(async () => {
      if (type === "create") {
        if (!file) {
          toast({
            title: "Please upload image",
            variant: "danger",
          })
          return
        }
        await handleUploadImage(file)
        const res = await createEmployee({ ...values, avatar })
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
        const { employeeCode, email, roleId, ...rest } = values
        await handleUploadImage(file)
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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault()

    const fileReader = new FileReader()

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFile(file)

      if (!file.type.includes("image")) return

      fileReader.onload = async (event) => {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const imageDataUrl = event.target?.result?.toString() || ""
        fieldChange(imageDataUrl)
      }

      fileReader.readAsDataURL(file)
    }
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
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div>
                          <div>{t("fields.avatar")}</div>
                          <div className="flex justify-center">
                            {field.value ? (
                              <div
                                className={cn(
                                  "group relative mt-2 flex size-32 items-center justify-center overflow-hidden rounded-md border-2"
                                )}
                              >
                                <Image
                                  src={field.value}
                                  alt="imageUrl"
                                  width={200}
                                  height={200}
                                  className="rounded-md object-contain group-hover:opacity-55"
                                />

                                <Button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    field.onChange("")
                                  }}
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-2 hidden group-hover:inline-flex"
                                >
                                  <Trash />
                                </Button>
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  "mt-2 flex size-32 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md border-[3px] border-dashed"
                                )}
                              >
                                <Icons.Upload className="size-6" />
                                <div>{t("btn.upload")}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          placeholder="Add profile photo"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.employeeCode")}</FormLabel>

                      <FormControl>
                        <Input
                          disabled={isPending || type === "update"}
                          {...field}
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
                              {role.roleId.toString()} -{" "}
                              {field.value.toString()}
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
