"use client"

import { useTransition } from "react"
import Link from "next/link"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { loginSchema, type TLoginSchema } from "@/lib/validations/auth/login"
import { login } from "@/actions/auth/login.action"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// type LoginFormProps = {
//   params: Promise<{ locale: string }>
// }

function LoginForm() {
  const t = useTranslations("LoginPage")
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
          title: t("LoginFailedTitle"),
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {t("Password")}
              </FormLabel>
              <FormControl>
                <Input
                  disabled={pending}
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" /> Remember me
          </div>
          <Link href={"#"}>Forgot password</Link>
        </div>
        <Button
          variant={"primary"}
          disabled={pending}
          type="submit"
          className="w-full"
        >
          {t("Login")} {pending && <Loader2 className="size-4 animate-spin" />}
        </Button>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            New User?{" "}
            <Link href="/en/register" className="text-blue-400 underline">
              Register Here
            </Link>
          </div>
          <Link href={"#"}>Use As Guest</Link>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
