"use client"

import { useEffect, useState, useTransition } from "react"
import { Link } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { http } from "@/lib/http"
import { cn } from "@/lib/utils"
import { otpSchema, type TOtpSchema } from "@/lib/validations/auth/otp"
import { verifyOtpChangePassword } from "@/actions/auth/verify-otp-change-password"
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
} from "@/components/ui/input-otp"

import NewPassForm from "./new-password-form"

type Props = {
  email: string
  type: "user" | "employee"
}

function ResetPasswordForm({ email, type }: Props) {
  const t = useTranslations("ResetPasswordPage")
  const [pending, startTransition] = useTransition()

  const [timeDisableResend, setTimeDisableResend] = useState(0)
  const queryClient = useQueryClient()
  const locale = useLocale()
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false)
  const [changePasswordToken, setChangePasswordToken] = useState<string>("")

  useQuery({
    queryKey: ["forgot-password", email],
    queryFn: async () =>
      await http.get(`/api/auth/forgot-password?Email=${email}`),
    refetchOnWindowFocus: false,
  })

  const form = useForm<TOtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(values: TOtpSchema) {
    startTransition(async () => {
      const res = await verifyOtpChangePassword(email, values.pin)

      if (res.isSuccess) {
        setShowNewPasswordForm(true)
        setChangePasswordToken(res.data.token)

        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  function handleResendCode(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault()
    e.stopPropagation()
    setTimeDisableResend(30)
    queryClient.invalidateQueries({
      queryKey: ["forgot-password", email],
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
    <>
      {!showNewPasswordForm ? (
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
                        timeDisableResend > 0 &&
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
              {t("Continue")}{" "}
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
      ) : (
        <NewPassForm
          type={type}
          email={email}
          changePasswordToken={changePasswordToken}
        />
      )}
    </>
  )
}

export default ResetPasswordForm
