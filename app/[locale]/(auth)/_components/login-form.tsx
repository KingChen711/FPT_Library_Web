"use client"

import React, { useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { loginSchema, type TLoginSchema } from "@/lib/validations/auth/login"
import { login } from "@/actions/auth/login"
import { useToast } from "@/hooks/use-toast"
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

function LoginForm() {
  const t = useTranslations("LoginPage")
  const router = useRouter()

  const { toast } = useToast()
  const { setToken } = useAuth()

  const [pending, startTransition] = useTransition()

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: TLoginSchema) {
    startTransition(async () => {
      const res = await login(values)

      if (res.isSuccess) {
        router.push("/")
        setToken(res.data.accessToken)
        return
      }

      if (res.typeError === "base") {
        toast({
          title: t("LoginFailedTitle"),
          description: res.messageError,
        })
        return
      }

      const keys = Object.keys(res.fieldErrors) as (keyof TLoginSchema)[]
      keys.forEach((key) =>
        form.setError(key, { message: res.fieldErrors[key] })
      )
      form.setFocus(keys[0])

      return
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Email")}</FormLabel>
              <FormControl>
                <Input disabled={pending} placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Password")}</FormLabel>
              <FormControl>
                <Input
                  disabled={pending}
                  type="password"
                  placeholder="shadcn"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={pending} type="submit">
          {t("Login")} {pending && <Loader2 className="size-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
