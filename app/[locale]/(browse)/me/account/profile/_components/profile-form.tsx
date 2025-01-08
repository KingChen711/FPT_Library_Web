/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Employee, type User } from "@/lib/types/models"
import {
  profileSchema,
  type TProfileSchema,
} from "@/lib/validations/auth/profile"
import { updateProfile } from "@/actions/auth/update-profile"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ProfileFormProps = {
  currentUser: User | Employee
}

const ProfileForm = ({ currentUser }: ProfileFormProps) => {
  console.log("🚀 ~ ProfileForm ~ currentUser:", currentUser)
  const t = useTranslations("Me.Account.Profile")
  const locale = useLocale()
  const [pending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      dob: currentUser.dob,
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      // gender: currentUser.gender || undefined,
      avatar: currentUser.avatar || "",
    },
  })

  function onSubmit(values: TProfileSchema) {
    startTransition(async () => {
      const res = await updateProfile(values)
      if (res.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["who-am-i"],
        })
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          variant: "success",
        })
        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  const handleReset = () => {
    form.reset()
  }

  return (
    <div className="container mt-8 flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="container space-y-4 px-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                disabled
                value={currentUser.email}
                className="mt-2 cursor-not-allowed"
              />
            </div>

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("firstName")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} {...field} />
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
                  <FormLabel>{t("lastName")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      {...field}
                      value={field.value || ""} // Fix
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
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      {...field}
                      value={field.value || ""} // Fix
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
                <FormItem>
                  <FormLabel>{t("dob")}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={pending}
                      {...field}
                      value={field.value || ""} // Fix
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
                  <FormLabel>{t("gender")}</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(
                        value !== undefined ? parseInt(value, 10) : undefined
                      )
                    }
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("gender")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">{t("male")}</SelectItem>
                      <SelectItem value="Female">{t("female")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full items-center justify-end gap-4">
            <Button disabled={pending} type="submit">
              {t("updateBtn")}
              {pending && <Loader2 className="size-4 animate-spin" />}
            </Button>
            <Button disabled={pending} variant={"ghost"} onClick={handleReset}>
              {t("resetBtn")}
              {pending && <Loader2 className="size-4 animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ProfileForm
