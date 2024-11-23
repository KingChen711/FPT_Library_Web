"use client"

import { useTransition } from "react"
import Link from "next/link"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { loginSchema, type TLoginSchema } from "@/lib/validations/auth/login"
import { login } from "@/actions/auth/login.action"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

function VerifyOtpForm() {
  const t = useTranslations("VerificationOtpPage")
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: TLoginSchema) {
    startTransition(async () => {
      const res = await login(values)

      if (res.isSuccess) {
        router.push("/")
        return
      }

      if (res.typeError === "base") {
        toast({
          title: t("VerificationOtpFailedTitle"),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Label className="text-base font-semibold">{t("EnterOTP")}</Label>
        <div className="flex justify-between">
          {Array.from({ length: 6 }, (_, index) => (
            <Input
              key={index}
              type="text"
              className="w-12 border-2 border-slate-400 text-center"
            />
          ))}
        </div>
        <Button
          variant={"primary"}
          disabled={pending}
          // type="submit"
          className="w-full"
          onClick={() => router.push("/verify-otp-success")}
        >
          {t("Verify")} {pending && <Loader2 className="size-4 animate-spin" />}
        </Button>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            Not yet received OTP?{" "}
            <Link href="/en/register" className="text-blue-400 underline">
              Resend
            </Link>
          </div>
          <Link href={"#"}>Back</Link>
        </div>
      </form>
    </Form>
  )
}

export default VerifyOtpForm
