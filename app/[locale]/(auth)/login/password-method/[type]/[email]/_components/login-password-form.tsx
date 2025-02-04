"use client"

import React, { useState, useTransition } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cn } from "@/lib/utils"
import {
  loginByPasswordSchema,
  type TLoginByPasswordSchema,
} from "@/lib/validations/auth/login-by-password"
import { loginByPassword } from "@/actions/auth/login-by-password"
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
  email: string
  type: "user" | "admin" | "employee"
}

function LoginPasswordForm({ email, type }: Props) {
  const t = useTranslations("LoginPage.PasswordMethodPage")
  const router = useRouter()
  const locale = useLocale()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const [pending, startTransition] = useTransition()

  const form = useForm<TLoginByPasswordSchema>({
    resolver: zodResolver(loginByPasswordSchema),
    defaultValues: {
      email,
      password: "",
    },
  })

  function onSubmit(values: TLoginByPasswordSchema) {
    startTransition(async () => {
      const res = await loginByPassword(values, type)

      if (res.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["token"],
        })
        router.push("/")
        return
      }

      if (
        res.typeError === "warning" &&
        res.resultCode === "Auth.Warning0010"
      ) {
        router.push(`/mfa/${values.email}`)
        return
      }

      if (
        res.typeError === "warning" &&
        res.resultCode === "Auth.Warning0011"
      ) {
        router.push(`/mfa/${values.email}/enable`)
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <FormLabel>{t("Password")}</FormLabel>
                  <Link
                    href={`/reset-password/${type === "employee" ? "employee" : "user"}/${email}`}
                    className="text-xs hover:underline"
                  >
                    {t("Forgot password?")}
                  </Link>
                </div>
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

          <Button disabled={pending} type="submit" className="w-full">
            {t("Login")}
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
    </>
  )
}

export default LoginPasswordForm
