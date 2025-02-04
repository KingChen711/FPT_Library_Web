"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type User } from "@/lib/types/models"
import {
  mutateUserSchema,
  type TMutateUserSchema,
} from "@/lib/validations/user/mutate-user"
import { createUser } from "@/actions/users/create-user"
import { updateUser } from "@/actions/users/update-user"
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
  user?: User
  openEdit?: boolean
  setOpenEdit?: (value: boolean) => void
} & (
  | {
      type: "create"
    }
  | {
      type: "update"
      user: User
      openEdit: boolean
      setOpenEdit: (value: boolean) => void
    }
)

function MutateUserDialog({ type, user, openEdit, setOpenEdit }: Props) {
  console.log("🚀 ~ MutateUserDialog ~ user:", user)
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
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
      firstName: type === "update" ? user.firstName : "",
      lastName: type === "update" ? user.lastName : "",
      phone: type === "update" ? user.phone : "",
      address: type === "update" ? user.address : "",
      gender: type === "update" ? user.gender : undefined,
      dob: type === "update" ? format(new Date(user.dob), "dd-MM-yyyy") : "",
    },
  })

  const onSubmit = async (values: TMutateUserSchema) => {
    startTransition(async () => {
      if (type === "create") {
        const res = await createUser(values)
        if (res.isSuccess) {
          form.reset()
          setOpen(false)
          toast({
            title: locale === "vi" ? "Thành công" : "Success",
            description: res.data,
            variant: "success",
          })
        } else {
          handleServerActionError(res, locale, form)
        }
      }
      if (type === "update") {
        const res = await updateUser(user.userId, values)
        if (res.isSuccess) {
          form.reset()
          setOpenEdit(false)
          toast({
            title: locale === "vi" ? "Thành công" : "Success",
            description: res.data,
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
                          type="text"
                          {...field}
                          disabled={isPending}
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.gender")}</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) =>
                          field.onChange(
                            value !== undefined ? value : undefined
                          )
                        }
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
                          <SelectItem value="Other">
                            {t("fields.other")}
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
