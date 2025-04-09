"use client"

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGoogleLogin } from "@react-oauth/google"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
// import { type ReactFacebookLoginInfo } from "react-facebook-login"
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { loginSchema, type TLoginSchema } from "@/lib/validations/auth/login"
import { login } from "@/actions/auth/login"
// import { loginFacebook } from "@/actions/auth/login-facebook"
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

function LoginForm() {
  const t = useTranslations("LoginPage")
  const locale = useLocale()
  const router = useRouter()
  // const queryClient = useQueryClient()
  const { refetchToken } = useAuth()

  const [pending, startTransition] = useTransition()

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (googleRes) => {
      startTransition(async () => {
        const res = await loginGoogle(googleRes.code)

        if (res.isSuccess) {
          // queryClient.invalidateQueries({
          //   queryKey: ["token"],
          // })
          refetchToken()
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
        if (res.data.resultCode === "Auth.Success0003") {
          router.push(
            `/login/password-method/${res.data.userType.toLocaleLowerCase()}/${values.email}`
          )
          return
        }

        if (res.data.resultCode === "Auth.Success0005") {
          if (res.data.userType === "Employee") {
            router.push(`/reset-password/employee/${values.email}`)
            return
          }
          router.push(`/login/otp-method/${values.email}`)
          return
        }

        return
      }

      if (res.typeError === "warning") {
        if (res.resultCode === "Auth.Warning0008") {
          router.push(`/verify-email/${values.email}`)
          return
        }

        if (res.resultCode === "Auth.Warning0011") {
          router.push(`/mfa/${values.email}/enable`)
          return
        }
      }

      handleServerActionError(res, locale, form)
    })
  }

  // const handleFacebookLogin = (response: ReactFacebookLoginInfo) => {
  //   startTransition(async () => {
  //     //@ts-ignore
  //     const res = await loginFacebook(response.accessToken, response.expiresIn)

  //     if (res.isSuccess) {
  //       queryClient.invalidateQueries({
  //         queryKey: ["token"],
  //       })
  //       router.push(`/`)
  //       return
  //     }

  //     handleServerActionError(res, locale, form)
  //   })
  // }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {/* @ts-ignore */}
        {/* <FacebookLogin
          appId="598749422623507"
          autoLoad={false}
          callback={handleFacebookLogin}
          render={(renderProps) => (
            <Button
              onClick={renderProps.onClick}
              variant="outline"
              size="sm"
              className="w-full min-w-40 flex-1"
              disabled={pending}
            >
              <Icons.Facebook className="mr-1 size-3" />
              Facebook
            </Button>
          )}
        /> */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          size="sm"
          className="w-full min-w-40 flex-1"
          disabled={pending}
        >
          <Icons.Google className="mr-1 size-3" />
          {t("Continue with Google")}
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
