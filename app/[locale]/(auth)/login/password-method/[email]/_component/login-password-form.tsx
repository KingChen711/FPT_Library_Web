"use client"

import React, { useTransition } from "react"
import { Link } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import {
  loginPasswordSchema,
  type TLoginPasswordSchema,
} from "@/lib/validations/auth/login-password"
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

type Props = {
  email: string
}

function LoginPasswordForm({ email }: Props) {
  const t = useTranslations("LoginPage.PasswordMethodPage")

  const [pending, startTransition] = useTransition()

  const form = useForm<TLoginPasswordSchema>({
    resolver: zodResolver(loginPasswordSchema),
    defaultValues: {
      password: "",
    },
  })

  function onSubmit(values: TLoginPasswordSchema) {
    console.log(values, startTransition, email)
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
                    href="/forgot-password"
                    className="text-xs hover:underline"
                  >
                    {t("Forgot password?")}
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" disabled={pending} {...field} />
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
