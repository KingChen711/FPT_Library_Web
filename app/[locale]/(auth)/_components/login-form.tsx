"use client"

import { useTransition } from "react"
import Script from "next/script"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { loginSchema, type TLoginSchema } from "@/lib/validations/auth/login"
import { login } from "@/actions/auth/login"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface WindowWithGoogle extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  google?: any
}

declare let window: WindowWithGoogle

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!

function LoginForm() {
  const queryClient = useQueryClient()
  const t = useTranslations("LoginPage")
  const locale = useLocale()
  const router = useRouter()

  const [pending, startTransition] = useTransition()

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(values: TLoginSchema) {
    startTransition(async () => {
      router.push(`/login/password-method/${values.email}`)

      console.log(queryClient, locale, handleServerActionError, login)

      // const res = await login(values)

      // if (res.isSuccess) {
      //   queryClient.invalidateQueries({
      //     queryKey: ["token"],
      //   })
      //   router.push("/")
      //   return
      // }

      // handleServerActionError(res, locale)
    })
  }

  const handleGoogleLogin = () => {
    if (!window.google) {
      console.error("Google SDK not loaded")
      return
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "profile email",
      callback: (response: { access_token: string }) => {
        console.log({ access_token: response.access_token })
      },
    })

    tokenClient.requestAccessToken()
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async defer />
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <Icons.Google className="mr-2 size-4" />
        {t("Continue with Google")}
      </Button>

      <div className="flex items-center gap-x-2">
        <Separator className="flex-1" />
        <p className="text-sm">{t("or")}</p>
        <Separator className="flex-1" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Email")}</FormLabel>
                <FormControl>
                  <Input type="email" disabled={pending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={pending} type="submit" className="w-full">
            {t("Login")}
            {pending && <Loader2 className="size-4 animate-spin" />}
          </Button>

          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              {t("Don’t have an account?")}
              <Link
                href="/register"
                className="text-foreground hover:underline"
              >
                {t("Register")}
              </Link>
            </div>
            <Link href="/" className="hover:underline">
              {t("Homepage")}
            </Link>
          </div>
        </form>
      </Form>
    </>
  )
}

export default LoginForm
