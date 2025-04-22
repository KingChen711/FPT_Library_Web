import React, { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone } from "@internationalized/date"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  suspendCardSchema,
  type TSuspendCardSchema,
} from "@/lib/validations/patrons/cards/suspend-card"
import { suspendCard } from "@/actions/library-card/cards/suspend-card"
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
import {
  createCalendarDate,
  DateTimePicker,
} from "@/components/form/date-time-picker"

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  libraryCardId: string
  userId: string
}

function SuspendCardDialog({ open, setOpen, libraryCardId, userId }: Props) {
  const timezone = getLocalTimeZone()
  const t = useTranslations("LibraryCardManagementPage")
  const locale = useLocale()

  const [pending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (pending) return
    setOpen(value)
  }

  const form = useForm<TSuspendCardSchema>({
    resolver: zodResolver(suspendCardSchema),
    defaultValues: {
      libraryCardId,
      reason: "",
    },
  })

  function onSubmit(values: TSuspendCardSchema) {
    startTransition(async () => {
      const res = await suspendCard(userId, values)

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
          <DialogTitle className="mb-2">{t("Suspend card")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="suspensionEndDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("Suspension end date")}</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={createCalendarDate(field.value)}
                          onChange={(date) =>
                            field.onChange(date ? date.toDate(timezone) : null)
                          }
                          disabled={(date) => {
                            return date < new Date()
                          }}
                        />
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
                      <FormLabel>{t("Suspend reason")}</FormLabel>
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

export default SuspendCardDialog
