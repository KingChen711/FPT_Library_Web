"use client"

import { useEffect, useState, useTransition } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { otpSchema, type TOtpSchema } from "@/lib/validations/auth/otp"
import { useToast } from "@/hooks/use-toast"
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

function VerifyOtpForm() {
  const t = useTranslations("ResetPasswordPage")
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()
  const [timeDisableResend, setTimeDisableResend] = useState(0)

  const form = useForm<TOtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(values: TOtpSchema) {
    console.log({ startTransition })

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
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
        <Button
          disabled={pending}
          // type="submit"
          className="w-full"
          onClick={() => router.push("/verify-otp-success")}
        >
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

export default VerifyOtpForm
