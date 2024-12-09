"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

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
import { Textarea } from "@/components/ui/textarea"

const ProfileForm = () => {
  const t = useTranslations("Me.Account.Profile")
  const [pending, startTransition] = useTransition()

  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: "Doan Viet Thanh",
      collegeEmailId: "thanhdvse171867@fpt.edu.vn",
      studentCode: "SE171867",
      phoneNumber: "0123456789",
      bio: "I am a student",
      dob: "2003-07-01",
      gender: "Male",
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
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fullName")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collegeEmailId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("collegeEmailId")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("studentCode")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} {...field} />
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dob")}</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={pending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("bio")}</FormLabel>
                <FormControl>
                  <Textarea disabled={pending} {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
