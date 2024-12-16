"use client"

import { useTransition } from "react"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { type Employee, type User } from "@/lib/types/models"
import {
  profileSchema,
  type TProfileSchema,
} from "@/lib/validations/auth/profile"
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
  const t = useTranslations("Me.Account.Profile")

  const [pending, startTransition] = useTransition()

  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentUser.firstName as string,
      lastName: currentUser.lastName as string,
      email: currentUser.email || null,
      phone: currentUser.phone || null,
      avatar: currentUser.avatar || null,
      address: currentUser.address || null,
      gender: currentUser.gender || null,
      dob: currentUser.dob || null,
    },
  })

  function onSubmit(values: TProfileSchema) {
    startTransition(async () => {
      console.log(values)
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      {...field}
                      value={field.value || ""} // Fix: Chuyển null thành chuỗi trống
                    />
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
                    disabled={pending}
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
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
