"use client"

import { useTransition } from "react"
import Script from "next/script"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { type TLoginSchema } from "@/lib/validations/auth/login"
import {
  registerSchema,
  type TRegisterSchema,
} from "@/lib/validations/auth/register"
import { login } from "@/actions/auth/login"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  const t = useTranslations("RegisterPage")
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      studentCode: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: TRegisterSchema) {
    startTransition(async () => {
      const res = await login(values)

      if (res.isSuccess) {
        router.push("/")
        return
      }

      if (res.typeError === "base") {
        toast({
          title: t("RegisterFailedTitle"),
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
        Continue with Google
      </Button>

      <div className="flex items-center gap-x-2">
        <Separator className="flex-1" />
        or
        <Separator className="flex-1" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="studentCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("StudentCode")}</FormLabel>
                <FormControl>
                  <Input disabled={pending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormLabel>Password</FormLabel>
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input disabled={pending} type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" /> Remember me
              </div>
              <Link href={"/forgot-password"}>Forgot password</Link>
            </div>
          </div>
          <Button disabled={pending} type="submit" className="w-full">
            {t("Register")}
            {pending && <Loader2 className="size-4 animate-spin" />}
          </Button>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              Already a user?
              <Link href="/login" className="text-foreground hover:underline">
                Login Here
              </Link>
            </div>
            <Link href={"#"}>Use As Guest</Link>
          </div>
        </form>
      </Form>
    </>
  )
}

export default RegisterForm
