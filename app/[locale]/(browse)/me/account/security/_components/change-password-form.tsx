"use client"

import { useEffect, useState, useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { http } from "@/lib/http"
import {
  newPassSchema,
  type TNewPassSchema,
} from "@/lib/validations/auth/new-password"
import { changePassword } from "@/actions/auth/change-password"
import { verifyOtpChangePassword } from "@/actions/auth/verify-otp-change-password"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

function ChangePassForm() {
  const t = useTranslations("ResetPasswordPage")
  const locale = useLocale()
  const queryClient = useQueryClient()

  const { toast } = useToast()
  const { user } = useAuth()

  const [pending, startTransition] = useTransition()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [timeDisableResend, setTimeDisableResend] = useState(0)
  const [enableForgetPassword, setEnableForgetPassword] = useState(false)

  const [otp, setOtp] = useState("")

  useQuery({
    queryKey: ["forgot-password", user?.email],
    queryFn: async () =>
      await http.get(`/api/auth/forgot-password?Email=${user?.email}`),
    refetchOnWindowFocus: false,
    enabled: enableForgetPassword,
  })

  const form = useForm<TNewPassSchema>({
    resolver: zodResolver(newPassSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
  })

  function onSubmit(values: TNewPassSchema) {
    console.log(values)

    setShowOtpInput(true)
    setEnableForgetPassword(true)

    if (!otp) return

    startTransition(async () => {
      const verifyRes = await verifyOtpChangePassword(user?.email || "", otp)

      if (verifyRes.isSuccess) {
        const res = await changePassword(
          user?.email || "",
          values.password,
          verifyRes.data.token,
          user?.role.roleType.toLowerCase() === "employee" ? "employee" : "user"
        )

        if (res.isSuccess) {
          toast({
            title: locale === "vi" ? "Thành công" : "Success",
            description: res.data,
            variant: "success",
          })

          setShowPasswordForm(false)
          setOtp("")
          setEnableForgetPassword(false)
          setEnableForgetPassword(false)
          form.setValue("password", "")
          form.setValue("confirmPassword", "")
          return
        }

        handleServerActionError(res, locale, form)
        return
      }

      handleServerActionError(verifyRes, locale, form)
    })
  }

  function handleResendCode(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault()
    e.stopPropagation()
    setTimeDisableResend(30)
    queryClient.invalidateQueries({
      queryKey: ["forgot-password", user?.email],
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

  if (!showPasswordForm) {
    return (
      <div className="flex w-96 max-w-full flex-wrap justify-between gap-4">
        <div className="text-lg font-bold tracking-widest">••••••••••</div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowPasswordForm(true)}
        >
          {t("Update password")}
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-96 max-w-full space-y-6 rounded-md border p-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("New password")}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-x-2 rounded-md border">
                  <Input
                    disabled={pending || showOtpInput}
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ConfirmedPassword")}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-x-2 rounded-md border">
                  <Input
                    disabled={pending || showOtpInput}
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

        {showOtpInput && (
          <div className="flex flex-col gap-y-2">
            <FormLabel>{t("OTP")}</FormLabel>
            <FormControl>
              <Input
                type="text"
                disabled={pending}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </FormControl>
            <FormDescription>
              {t("OTP message")}

              <Button
                onClick={handleResendCode}
                disabled={timeDisableResend > 0}
                className="min-h-0 min-w-0 p-0 text-sm hover:bg-transparent hover:underline"
                variant="ghost"
              >
                {t("No code")}{" "}
                {timeDisableResend > 0 ? `(${timeDisableResend})` : null}
              </Button>
            </FormDescription>
            <FormMessage />
          </div>
        )}

        <div className="flex items-center gap-x-4">
          <Button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowPasswordForm(false)
            }}
            variant="outline"
            disabled={pending}
            type="submit"
            className="w-full"
          >
            {t("Cancel")}{" "}
          </Button>
          <Button disabled={pending} type="submit" className="w-full">
            {t("Continue")}{" "}
            {pending && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ChangePassForm
