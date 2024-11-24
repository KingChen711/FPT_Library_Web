"use client"

import { useTransition } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { loginSchema, type TLoginSchema } from "@/lib/validations/auth/login"
import { login } from "@/actions/auth/login"
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

function LoginForm() {
  const t = useTranslations("LoginPage")
  const router = useRouter()
  const queryClient = useQueryClient()

  const { toast } = useToast()

  const [pending, startTransition] = useTransition()

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
        queryClient.invalidateQueries({
          queryKey: ["token"],
        })
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Email")}</FormLabel>
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
        <div className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Password")}</FormLabel>
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
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" /> Remember me
            </div>
            <Link href="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button disabled={pending} type="submit" className="w-full">
          {t("Login")} {pending && <Loader2 className="size-4 animate-spin" />}
        </Button>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            New user?
            <Link href="/register" className="text-foreground hover:underline">
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
