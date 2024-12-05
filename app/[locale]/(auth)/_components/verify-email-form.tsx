"use client"

import { useEffect, useState, useTransition } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { otpSchema, type TOtpSchema } from "@/lib/validations/auth/otp"
import { verifyEmail } from "@/actions/auth/verify-email"
import { toast } from "@/hooks/use-toast"
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

type Props = {
  email: string
}

function VerifyEmailForm({ email }: Props) {
  const t = useTranslations("ResetPasswordPage")
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const locale = useLocale()
  const [timeDisableResend, setTimeDisableResend] = useState(0)

  const form = useForm<TOtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(values: TOtpSchema) {
    startTransition(async () => {
      const res = await verifyEmail(email, values.pin)

      if (res.isSuccess) {
        router.push(`/login`)
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
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
  )
}

export default VerifyEmailForm
