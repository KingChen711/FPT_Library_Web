import React, { useState, useTransition } from "react"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ETransactionStatus } from "@/lib/types/enums"
import {
  cancelPaymentSchema,
  type TCancelPaymentSchema,
} from "@/lib/validations/payment/cancel-payment"
import { cancelPayment } from "@/actions/payment/cancel-payment"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  currentStatus: ETransactionStatus
  orderCode: string
  paymentLinkId: string
  userId?: string
}

function CancelPaymentDialog({
  currentStatus,
  paymentLinkId,
  orderCode,
  userId,
}: Props) {
  const [open, setOpen] = useState(false)

  const t = useTranslations("LibraryCardManagementPage")
  const locale = useLocale()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (pending) return
    setOpen(value)
  }

  const form = useForm<TCancelPaymentSchema>({
    resolver: zodResolver(cancelPaymentSchema),
    defaultValues: {
      orderCode,
      paymentLinkId,
      cancellationReason: "",
    },
  })

  function onSubmit(values: TCancelPaymentSchema) {
    startTransition(async () => {
      const res = await cancelPayment(values)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        router.push(
          `/management/library-card-holders${userId ? "/" + userId : ""}`
        )
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          disabled={currentStatus !== ETransactionStatus.PENDING || pending}
          variant="secondary"
          className="mt-4 min-w-28"
          size="sm"
        >
          {t("Cancel")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Cancel payment")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="cancellationReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Cancel reason")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={pending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    disabled={
                      currentStatus !== ETransactionStatus.PENDING || pending
                    }
                    type="submit"
                  >
                    {t("Continue")}
                    {pending && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CancelPaymentDialog
