"use client"

import { useState, useTransition } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGoogleLogin } from "@react-oauth/google"
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  registerSchema,
  type TRegisterSchema,
} from "@/lib/validations/auth/register"
import { loginGoogle } from "@/actions/auth/login-google"
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

function RegisterForm() {
  const locale = useLocale()
  const t = useTranslations("RegisterPage")
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

      if (res.isSuccess) {
        router.push(`/verify-email/${values.email}`)
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

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
                  <div className="flex items-center gap-x-2 rounded-md border">
                    <Input
                      disabled={pending}
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="border-none outline-none focus-visible:ring-transparent"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowPassword((prev) => !prev)
                      }}
                    >
                      {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                    </Button>
                  </div>
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
                    <div className="flex items-center gap-x-2 rounded-md border">
                      <Input
                        disabled={pending}
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        className="border-none outline-none focus-visible:ring-transparent"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setShowConfirmPassword((prev) => !prev)
                        }}
                      >
                        {showConfirmPassword ? <EyeIcon /> : <EyeClosedIcon />}
                      </Button>
                    </div>
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
