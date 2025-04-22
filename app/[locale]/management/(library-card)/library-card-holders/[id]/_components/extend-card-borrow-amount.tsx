import React, { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  extendCardBorrowAmountSchema,
  type TExtendCardBorrowAmountSchema,
} from "@/lib/validations/patrons/cards/extend-card-borrow-amount"
import { extendCardBorrowAmount } from "@/actions/library-card/cards/extend-card-borrow-amount"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  open: boolean
  setOpen: (val: boolean) => void
  libraryCardId: string
  userId: string
}

function ExtendCardBorrowAmountDialog({
  open,
  setOpen,
  libraryCardId,
  userId,
}: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const locale = useLocale()

  const [pending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (pending) return
    setOpen(value)
  }

  const form = useForm<TExtendCardBorrowAmountSchema>({
    resolver: zodResolver(extendCardBorrowAmountSchema),
    defaultValues: {
      libraryCardId,
      reason: "",
      maxItemOnceTime: 0,
    },
  })

  function onSubmit(values: TExtendCardBorrowAmountSchema) {
    startTransition(async () => {
      const res = await extendCardBorrowAmount(userId, values)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)

        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">
            {t("Extend borrow amount")}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="maxItemOnceTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Max item once time")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={pending} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Extend reason")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={pending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button disabled={pending} type="submit">
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

export default ExtendCardBorrowAmountDialog
