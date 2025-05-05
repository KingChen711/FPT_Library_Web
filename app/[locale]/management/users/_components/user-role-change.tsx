"use client"

import { useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type User } from "@/lib/types/models"
import { updateUserRole } from "@/actions/users/update-user-role"
import { toast } from "@/hooks/use-toast"
import useUserRoles from "@/hooks/users/use-user-roles"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  user: User
}

const formSchema = z.object({
  roleId: z.number({ message: "required" }).optional(),
})

const UserRoleChange = ({ open, setOpen, user }: Props) => {
  const locale = useLocale()
  const tGeneralManagement = useTranslations("GeneralManagement")
  const tUserManagement = useTranslations("UserManagement")
  const [pending, startUpdateRole] = useTransition()
  const { data: userRoles, isLoading } = useUserRoles()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleId: user.role.roleId || undefined,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        roleId: user.role.roleId || undefined,
      })
    }
  }, [user.role.roleId, form, open])

  if (isLoading || !userRoles) return null

  function onSubmit(values: z.infer<typeof formSchema>) {
    startUpdateRole(async () => {
      const res = await updateUserRole(user.userId, values.roleId!)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        form.reset(
          {
            roleId: user.role.roleId || undefined,
          },
          {
            keepDefaultValues: true,
          }
        )
        setOpen(false)
        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">
            {tUserManagement("update user role")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                      }}
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={tUserManagement("choose user role")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((role) => (
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
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-4">
              <Button
                className="flex-1"
                variant="secondary"
                type="button"
                onClick={() => setOpen(false)}
              >
                {tGeneralManagement("btn.cancel")}
              </Button>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                className="flex-1"
                disabled={pending}
              >
                {tGeneralManagement("btn.save")}
                {pending && <Loader2 className="ml-2 size-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UserRoleChange
