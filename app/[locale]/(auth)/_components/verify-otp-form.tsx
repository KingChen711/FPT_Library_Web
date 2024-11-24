"use client"

import { useTransition } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

const formSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

type TFormSchema = z.infer<typeof formSchema>

function VerifyOtpForm() {
  const t = useTranslations("VerificationOtpPage")
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(values: TFormSchema) {
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
                Please enter the one-time password sent to your email.
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
          {t("Verify")} {pending && <Loader2 className="size-4 animate-spin" />}
        </Button>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            Not yet received OTP?
            <Link href="/login" className="text-foreground hover:underline">
              Resend
            </Link>
          </div>
          <Button className="w-fit" variant="ghost" asChild>
            <Link href="/login" className="flex items-center gap-1 text-sm">
              <ArrowLeft className="size-5" /> Back
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default VerifyOtpForm
