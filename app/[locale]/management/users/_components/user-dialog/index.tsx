"use client"

import { useEffect, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, SquarePen } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  userDialogSchema,
  type TUserDialogSchema,
} from "@/lib/validations/auth/user-dialog"
import { createUser } from "@/actions/users/create-user"
import { updateUser } from "@/actions/users/update-user"
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

import UserDialogGender from "./user-dialog-gender"
import UserDialogInput from "./user-dialog-input"

type UserDialogFormProps = {
  mode: "create" | "update"
  user?: TUserDialogSchema
  userId?: string
}

const UserDialogForm = ({ mode, user, userId }: UserDialogFormProps) => {
  const locale = useLocale()
  const [pending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState<boolean>(false)
  const tUserManagement = useTranslations("UserManagement")
  const tGeneralManagement = useTranslations("GeneralManagement")

  const form = useForm<TUserDialogSchema>({
    resolver: zodResolver(userDialogSchema),
    defaultValues: {
      userCode: user?.userCode ?? "",
      email: user?.email ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      dob: user?.dob ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      gender: user?.gender ?? -1,
    },
  })

  useEffect(() => {
    form.reset()
    form.clearErrors()
  }, [form, isOpen])

  const onSubmit = async (values: TUserDialogSchema) => {
    startTransition(async () => {
      const res =
        mode === "create"
          ? await createUser(values)
          : await updateUser(userId as string, values)
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
            {tUserManagement("create user")}
          </Button>
        </DialogTrigger>
      )}

      {mode === "update" && user && (
        <DialogTrigger asChild>
          <div className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent">
            <SquarePen size={16} /> {tUserManagement("update user")}
          </div>
        </DialogTrigger>
      )}

      <DialogContent className="m-0 overflow-hidden p-0 pb-4">
        <DialogHeader className="w-full space-y-4 bg-primary p-4">
          <DialogTitle className="text-center text-primary-foreground">
            {mode === "create"
              ? tUserManagement("create user")
              : tUserManagement("update user")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="container h-[60vh] space-y-4 overflow-y-auto px-4"
          >
            <div className="space-y-2">
              <UserDialogInput
                form={form}
                fieldName="userCode"
                pending={pending}
                formLabel={tGeneralManagement("fields.userCode")}
                inputPlaceholder={tGeneralManagement("placeholder.code")}
              />
              <UserDialogInput
                form={form}
                fieldName="email"
                pending={pending}
                inputType="email"
                formLabel={tGeneralManagement("fields.email")}
                inputPlaceholder={tGeneralManagement("placeholder.email")}
              />
              <UserDialogInput
                form={form}
                fieldName="firstName"
                pending={pending}
                formLabel={tGeneralManagement("fields.firstName")}
                inputPlaceholder={tGeneralManagement("placeholder.firstName")}
              />
              <UserDialogInput
                form={form}
                fieldName="lastName"
                pending={pending}
                formLabel={tGeneralManagement("fields.lastName")}
                inputPlaceholder={tGeneralManagement("placeholder.lastName")}
              />
              <UserDialogInput
                form={form}
                fieldName="phone"
                pending={pending}
                formLabel={tGeneralManagement("fields.phone")}
                inputPlaceholder={tGeneralManagement("placeholder.phone")}
              />
              <UserDialogInput
                form={form}
                fieldName="address"
                pending={pending}
                formLabel={tGeneralManagement("fields.address")}
                inputPlaceholder={tGeneralManagement("placeholder.address")}
              />
              <UserDialogInput
                form={form}
                fieldName="dob"
                pending={pending}
                inputType="date"
                formLabel={tGeneralManagement("fields.dob")}
                inputPlaceholder={tGeneralManagement("placeholder.dob")}
              />

              <UserDialogGender
                form={form}
                fieldName="gender"
                pending={pending}
                formLabel={tGeneralManagement("fields.gender")}
                selectPlaceholder={tGeneralManagement("placeholder.gender")}
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

export default UserDialogForm
