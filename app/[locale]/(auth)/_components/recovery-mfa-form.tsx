"use client"

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  recoveryMfaSchema,
  type TRecoveryMfaSchema,
} from "@/lib/validations/auth/recovery-mfa-schema"
import { validateBackupCode } from "@/actions/auth/validate-backup-code"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type Props = {
  email: string
}

function RecoveryMfaForm({ email }: Props) {
  const t = useTranslations("RecoveryMfaPage")
  const locale = useLocale()
  const router = useRouter()
  // const queryClient = useQueryClient()
  const { refetchToken } = useAuth()

  const [pending, startTransition] = useTransition()

  const form = useForm<TRecoveryMfaSchema>({
    resolver: zodResolver(recoveryMfaSchema),
    defaultValues: {
      backupCode: "",
    },
  })

  function onSubmit(values: TRecoveryMfaSchema) {
    startTransition(async () => {
      const res = await validateBackupCode(email, values.backupCode)

      if (res.isSuccess) {
        // queryClient.invalidateQueries({
        //   queryKey: ["token"],
        // })
        refetchToken()
        router.push("/")
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
          name="backupCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("BackupCode")}</FormLabel>
              <FormControl>
                <Input disabled={pending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={pending} type="submit" className="w-full">
          {t("Continue")}
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

export default RecoveryMfaForm
