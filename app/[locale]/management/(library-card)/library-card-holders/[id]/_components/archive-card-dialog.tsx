import React, { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  archiveCardSchema,
  type TArchiveCardSchema,
} from "@/lib/validations/patrons/cards/archive-card"
import { archiveCard } from "@/actions/library-card/cards/archive-card"
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

function ArchiveCardDialog({ open, setOpen, libraryCardId, userId }: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const locale = useLocale()

  const [pending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (pending) return
    setOpen(value)
  }

  const form = useForm<TArchiveCardSchema>({
    resolver: zodResolver(archiveCardSchema),
    defaultValues: {
      libraryCardId,
      archiveReason: "",
    },
  })

  function onSubmit(values: TArchiveCardSchema) {
    startTransition(async () => {
      const res = await archiveCard(userId, values)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        form.reset()
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Archive card")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="archiveReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Archive reason")}</FormLabel>
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

export default ArchiveCardDialog
