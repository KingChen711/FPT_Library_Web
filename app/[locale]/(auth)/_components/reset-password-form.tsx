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
import { otpSchema, type TOtpSchema } from "@/lib/validations/auth/otp"
import { verifyOtpChangePassword } from "@/actions/auth/verify-otp-change-password"
import { Button } from "@/components/ui/button"
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
}

function ResetPasswordForm({ email }: Props) {
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
      await http.get(`/api/auth/forgot-password?Email=${email}`, {
        lang: locale,
      }),
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

  function handleResendCode(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
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
                    <Button
                      onClick={handleResendCode}
                      disabled={timeDisableResend > 0}
                      className="min-h-0 min-w-0 p-0 hover:bg-transparent hover:underline"
                      variant="ghost"
                    >
                      {t("No code")}{" "}
                      {timeDisableResend > 0 ? `(${timeDisableResend})` : null}
                    </Button>
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
        <NewPassForm email={email} changePasswordToken={changePasswordToken} />
      )}
    </>
  )
}

export default ResetPasswordForm
