"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cn } from "@/lib/utils"
import { otpSchema, type TOtpSchema } from "@/lib/validations/auth/otp"
import { loginByOtp } from "@/actions/auth/login-by-otp"
import { resendOtp } from "@/actions/auth/resend-otp"
import { toast } from "@/hooks/use-toast"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/form/input-otp"

type Props = {
  email: string
}

function LoginOtpForm({ email }: Props) {
  const t = useTranslations("LoginPage.OtpMethodPage")
  const [pending, startTransition] = useTransition()
  const [pendingResendOtp, startResendOtp] = useTransition()
  const router = useRouter()
  const locale = useLocale()
  const queryClient = useQueryClient()

  const [timeDisableResend, setTimeDisableResend] = useState(0)

  const form = useForm<TOtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(values: TOtpSchema) {
    startTransition(async () => {
      const res = await loginByOtp(email, values.pin)

      if (res.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["token"],
        })

        router.push(`/`)
        return
      }

      if (
        res.typeError === "warning" &&
        res.resultCode === "Auth.Warning0010"
      ) {
        router.push(`/mfa/${email}`)
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  function handleResendCode(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault()
    e.stopPropagation()
    setTimeDisableResend(30)

    startResendOtp(async () => {
      const res = await resendOtp(email)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        return
      }
    })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeDisableResend > 0) {
        setTimeDisableResend((prev) => prev - 1)
      }
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [timeDisableResend])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                <div
                  onClick={handleResendCode}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "min-h-0 min-w-0 cursor-pointer p-0 hover:bg-transparent hover:underline",
                    (timeDisableResend > 0 || pendingResendOtp) &&
                      "pointer-events-none text-muted-foreground"
                  )}
                >
                  {t("No code")}{" "}
                  {timeDisableResend > 0 ? `(${timeDisableResend})` : null}
                </div>
              </FormDescription>
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
  )
}

export default LoginOtpForm
