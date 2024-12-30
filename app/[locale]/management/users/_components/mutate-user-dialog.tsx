"use client"

import { useState, useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { type TUserRole } from "@/queries/users/get-user-roles"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { type User } from "@/lib/types/models"
import {
  mutateUserSchema,
  type TMutateUserSchema,
} from "@/lib/validations/user/mutate-user"
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
  user?: User
  openEdit?: boolean
  setOpenEdit?: (value: boolean) => void
} & (
  | {
      type: "create"
      userRoles: TUserRole[]
    }
  | {
      type: "update"
      user: User
      openEdit: boolean
      setOpenEdit: (value: boolean) => void
      userRoles: TUserRole[]
    }
)

function MutateUserDialog({
  type,
  user,
  openEdit,
  setOpenEdit,
  userRoles,
}: Props) {
  const { accessToken } = useAuth()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const t = useTranslations("GeneralManagement")
  const tUserManagement = useTranslations("UserManagement")
  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    if (type === "create") {
      setOpen(value)
      return
    }
    setOpenEdit(value)
  }

  const form = useForm<TMutateUserSchema>({
    resolver: zodResolver(mutateUserSchema),
    defaultValues: {
      userCode: type === "update" ? user.userCode : "",
      email: type === "update" ? user.email : "",
      roleId: type === "update" ? user.roleId : 0,

      firstName: type === "update" ? user.firstName : "",
      lastName: type === "update" ? user.lastName : "",
      phone: type === "update" ? user.phone : "",
      address: type === "update" ? user.address : "",
      gender: type === "update" ? user.gender : "Male",
      avatar: type === "update" ? user.avatar : "",
      dob:
        type === "update"
          ? format(new Date(user.dob), "yyyy-MM-dd")
          : "2025-07-07",
    },
  })

  if (userRoles.length === 0) return <Loader2 className="size-8 animate-spin" />

  const onSubmit = async (values: TMutateUserSchema) => {
    console.log("🚀 ~ onSubmit ~ values:", values)
    // startTransition(async () => {
    //   if (type === "create") {
    //     const res = await createUser(values)
    //     if (res.isSuccess) {
    //       form.reset()
    //       setOpen(false)
    //       toast({
    //         title: "Create user successfully",
    //         variant: "success",
    //       })
    //     } else {
    //       handleServerActionError(res, locale, form)
    //     }
    //   }
    //   if (type === "update") {
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     const { userCode, email, roleId, ...rest } = values
    //     const res = await updateUser(user.userId, values)
    //     if (res.isSuccess) {
    //       form.reset()
    //       setOpenEdit(false)
    //       toast({
    //         title: "Update user successfully",
    //         variant: "success",
    //       })
    //     } else {
    //       handleServerActionError(res, locale, form)
    //     }
    //   }
    // })
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
            <div>{tUserManagement("create user")}</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tUserManagement(type === "create" ? "create user" : "update user")}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="userCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.userCode")}</FormLabel>

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
                          {userRoles.map((role) => (
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

export default MutateUserDialog
