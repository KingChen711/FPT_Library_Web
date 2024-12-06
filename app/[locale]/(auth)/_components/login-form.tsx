"use client"

import { useTransition } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGoogleLogin } from "@react-oauth/google"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { loginSchema, type TLoginSchema } from "@/lib/validations/auth/login"
import { login } from "@/actions/auth/login"
import { loginGoogle } from "@/actions/auth/login-google"
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

//TODO: update validate
function LoginForm() {
  const t = useTranslations("LoginPage")
  const locale = useLocale()
  const router = useRouter()

  const [pending, startTransition] = useTransition()

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (googleRes) => {
      startTransition(async () => {
        const res = await loginGoogle(googleRes.code)

        if (res.isSuccess) {
          router.push(`/`)
          return
        }

        handleServerActionError(res, locale, form)
      })
    },
    flow: "auth-code",
  })

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(values: TLoginSchema) {
    startTransition(async () => {
      const res = await login(values)

      if (res.isSuccess) {
        if (res.data === "Auth.Success0003") {
          router.push(`/login/password-method/${values.email}`)
          return
        }

        router.push(`/login/otp-method/${values.email}`)
        return
      }

      if (
        res.typeError === "warning" &&
        res.resultCode === "Auth.Warning0008"
      ) {
        router.push(`/verify-email/${values.email}`)
      }

      handleServerActionError(res, locale, form)
    })
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full min-w-40 flex-1"
          disabled={pending}
        >
          <Icons.Facebook className="mr-1 size-3" />
          Facebook
        </Button>
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          size="sm"
          className="w-full min-w-40 flex-1"
          disabled={pending}
        >
          <Icons.Google className="mr-1 size-3" />
          {t("Google")}
        </Button>
      </div>

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
