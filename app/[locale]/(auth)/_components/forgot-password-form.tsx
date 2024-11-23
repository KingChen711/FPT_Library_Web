"use client"

import { useTransition } from "react"
import Link from "next/link"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { loginSchema, type TLoginSchema } from "@/lib/validations/auth/login"
import { login } from "@/actions/auth/login.action"
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

function ForgotPasswordForm() {
  const t = useTranslations("ForgotPasswordPage")
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(values: TLoginSchema) {
    router.push("/en/verify-otp")
    console.log("🚀 ~ onSubmit ~ values:", values)

    // startTransition(async () => {
    //   const res = await login(values)

    //   if (res.isSuccess) {
    //     router.push("/")
    //     return
    //   }

    //   if (res.typeError === "base") {
    //     toast({
    //       title: t("ForgotPasswordFailedTitle"),
    //       description: res.messageError,
    //     })
    //     return
    //   }

    //   const keys = Object.keys(res.fieldErrors) as (keyof TLoginSchema)[]
    //   keys.forEach((key) =>
    //     form.setError(key, { message: res.fieldErrors[key] })
    //   )
    //   form.setFocus(keys[0])

    //   return
    // })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {t("Email")}
              </FormLabel>
              <FormControl>
                <Input
                  disabled={pending}
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant={"primary"}
          disabled={pending}
          // type="submit"
          className="w-full"
          onClick={() => router.push("/verify-otp")}
        >
          {t("Continue")}
          {pending && <Loader2 className="size-4 animate-spin" />}
        </Button>

        <Link href="/en/login" className="flex items-center gap-2">
          <ArrowLeft /> {t("BackToLogin")}
        </Link>
      </form>
    </Form>
  )
}

export default ForgotPasswordForm
