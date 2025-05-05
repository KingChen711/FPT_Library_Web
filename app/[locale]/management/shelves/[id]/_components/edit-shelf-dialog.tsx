"use client"

import React, { useTransition } from "react"
import { type ShelfDetail } from "@/queries/shelves/get-shelf"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  editShelfSchema,
  type TEditShelfSchema,
} from "@/lib/validations/shelves/edit-shelf"
import { editShelf } from "@/actions/shelves/edit-shelf"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
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
import { Label } from "@/components/ui/label"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  shelf: ShelfDetail
}

function EditShelfDialog({ shelf, open, setOpen }: Props) {
  const t = useTranslations("ShelvesManagementPage")

  const locale = useLocale()

  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TEditShelfSchema>({
    resolver: zodResolver(editShelfSchema),
    defaultValues: {
      classificationNumberRangeTo: shelf.classificationNumberRangeTo,
      classificationNumberRangeFrom: shelf.classificationNumberRangeFrom,
      engShelfName: shelf.engShelfName,
      vieShelfName: shelf.vieShelfName,
      shelfNumber: shelf.shelfNumber,
    },
  })

  const onSubmit = async (values: TEditShelfSchema) => {
    startTransition(async () => {
      const res = await editShelf(shelf.shelfId, values)
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
      <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="mb-2">{t("Edit shelf")}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="shelfNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Shelf number")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2">
                  <Label>
                    {t("Classification number range")}
                    <span className="ml-1 text-xl font-bold leading-none text-primary">
                      *
                    </span>
                  </Label>
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="classificationNumberRangeFrom"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="shrink-0 pt-[6px] font-bold">-</div>
                    <FormField
                      control={form.control}
                      name="classificationNumberRangeTo"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="engShelfName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Eng shelf name")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vieShelfName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Vie shelf name")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button
                      disabled={isPending}
                      variant="secondary"
                      className="float-right mt-4"
                    >
                      {t("Cancel")}
                    </Button>
                  </DialogClose>

                  <Button
                    disabled={isPending}
                    type="submit"
                    className="float-right mt-4"
                  >
                    {t("Save")}
                    {isPending && (
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

export default EditShelfDialog
