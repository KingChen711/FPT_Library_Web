"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cn } from "@/lib/utils"
import {
  newPassSchema,
  type TNewPassSchema,
} from "@/lib/validations/auth/new-password"
import { changePassword } from "@/actions/auth/change-password"
import { useToast } from "@/hooks/use-toast"
import { Button, buttonVariants } from "@/components/ui/button"
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
  changePasswordToken: string
  email: string
  type: "user" | "employee"
}

function NewPassForm({ changePasswordToken, email, type }: Props) {
  const t = useTranslations("ResetPasswordPage")
  const locale = useLocale()
  const router = useRouter()
  const { toast } = useToast()

  const [pending, startTransition] = useTransition()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<TNewPassSchema>({
    resolver: zodResolver(newPassSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
  })

  function onSubmit(values: TNewPassSchema) {
    startTransition(async () => {
      const res = await changePassword(
        email,
        values.password,
        changePasswordToken,
        type
      )

      if (res.isSuccess) {
        router.push(`/login`)
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Password")}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-x-2 rounded-md border">
                  <Input
                    disabled={pending}
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="border-none outline-none focus-visible:ring-transparent"
                  />
                  <div
                    className={cn(
                      buttonVariants({ size: "icon", variant: "ghost" })
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowPassword((prev) => !prev)
                    }}
                  >
                    {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ConfirmedPassword")}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-x-2 rounded-md border">
                  <Input
                    disabled={pending}
                    type={showConfirmPassword ? "text" : "password"}
                    {...field}
                    className="border-none outline-none focus-visible:ring-transparent"
                  />
                  <div
                    className={cn(
                      buttonVariants({ size: "icon", variant: "ghost" })
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowConfirmPassword((prev) => !prev)
                    }}
                  >
                    {showConfirmPassword ? <EyeIcon /> : <EyeClosedIcon />}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={pending} type="submit" className="w-full">
          {t("Continue")}{" "}
          {pending && <Loader2 className="size-4 animate-spin" />}
        </Button>

        <Link
          href="/login"
          className="block cursor-pointer text-center text-sm font-bold hover:underline"
        >
          {t("Back to login")}
        </Link>
      </form>
    </Form>
  )
}

export default NewPassForm
