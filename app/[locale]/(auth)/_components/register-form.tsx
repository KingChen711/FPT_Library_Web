"use client"

import { useTransition } from "react"
import Script from "next/script"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  registerSchema,
  type TRegisterSchema,
} from "@/lib/validations/auth/register"
import { register } from "@/actions/auth/register"
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

function RegisterForm() {
  const locale = useLocale()
  const t = useTranslations("RegisterPage")
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  })

  function onSubmit(values: TRegisterSchema) {
    startTransition(async () => {
      const res = await register(values)

      // if (res.isSuccess) {
      //   router.push("/sign-in")
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
        {t("or")}
        <Separator className="flex-1" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-wrap gap-x-4 gap-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="min-w-[160px] flex-1">
                  <FormLabel>{t("FirstName")}</FormLabel>
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
                <FormItem className="min-w-[160px] flex-1">
                  <FormLabel>{t("LastName")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Email")}</FormLabel>
                <FormControl>
                  <Input disabled={pending} {...field} />
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
                  <Input disabled={pending} type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-y-4">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ConfirmedPassword")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={pending} type="submit" className="w-full">
            {t("Register")}
            {pending && <Loader2 className="size-4 animate-spin" />}
          </Button>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              {t("Already have an account?")}
              <Link href="/login" className="text-foreground hover:underline">
                {t("Sign in")}
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

export default RegisterForm
