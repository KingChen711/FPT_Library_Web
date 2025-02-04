"use client"

import React, { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ERoleType } from "@/lib/types/enums"
import {
  mutateRoleSchema,
  type TMutateRoleSchema,
} from "@/lib/validations/roles/mutate-role"
import { updateRole } from "@/actions/roles/update-role"
import useRole from "@/hooks/roles/use-role"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

type Props = {
  openEdit: boolean
  setOpenEdit: (value: boolean) => void
  roleId: number
}

function EditRoleDialog({ openEdit, setOpenEdit, roleId }: Props) {
  const t = useTranslations("RoleManagement")
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpenEdit(value)
  }

  const form = useForm<TMutateRoleSchema>({
    resolver: zodResolver(mutateRoleSchema),
    defaultValues: {
      englishName: "",
      vietnameseName: "",
      roleTypeIdx: ERoleType.USER,
    },
  })

  //get updated role
  const { isLoading } = useRole(
    roleId,
    (data) => {
      form.setValue("englishName", data.englishName)
      form.setValue("vietnameseName", data.vietnameseName)
      form.setValue("roleTypeIdx", data.roleType)
    },
    openEdit
  )

  const onSubmit = async (values: TMutateRoleSchema) => {
    startTransition(async () => {
      const res = await updateRole(roleId, values)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpenEdit(false)
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={openEdit} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Edit role")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="englishName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("English name")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending || isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vietnameseName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("Vietnamese name")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending || isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button
                      disabled={isPending || isLoading}
                      variant="secondary"
                      className="float-right mt-4"
                    >
                      {t("Cancel")}
                    </Button>
                  </DialogClose>

                  <Button
                    disabled={isPending || isLoading}
                    type="submit"
                    className="float-right mt-4"
                  >
                    {t("Save")}{" "}
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

export default EditRoleDialog
