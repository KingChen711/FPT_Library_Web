"use client"

import { useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { otpSchema, type TOtpSchema } from "@/lib/validations/auth/otp"
import { validateMfa } from "@/actions/auth/validate-mfa"
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
} from "@/components/form/input-otp"

type Props = {
  email: string
  validatePage?: boolean
  hideBackToLogin?: boolean
}

function MfaForm({
  email,
  validatePage = false,
  hideBackToLogin = false,
}: Props) {
  const t = useTranslations("ResetPasswordPage")
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const locale = useLocale()
  // const queryClient = useQueryClient()
  const { refetchToken } = useAuth()

  const form = useForm<TOtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(values: TOtpSchema) {
    startTransition(async () => {
      const res = await validateMfa(email, values.pin)

      if (res.isSuccess) {
        // queryClient.invalidateQueries({
        //   queryKey: ["token"],
        // })
        refetchToken()
        if (!hideBackToLogin) {
          router.push("/")
        }
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

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
              {validatePage && (
                <FormDescription>
                  <Link
                    href={`/mfa/${email}/recovery`}
                    className="min-h-0 min-w-0 p-0 hover:bg-transparent hover:underline"
                  >
                    {t("Missing mfa")}
                  </Link>
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={pending} type="submit" className="w-full">
          {t("Continue")}{" "}
          {pending && <Loader2 className="size-4 animate-spin" />}
        </Button>

        {!hideBackToLogin && (
          <Link
            href="/login"
            className="block cursor-pointer text-center text-sm font-bold hover:underline"
          >
            {t("Back to login")}
          </Link>
        )}
      </form>
    </Form>
  )
}

export default MfaForm
