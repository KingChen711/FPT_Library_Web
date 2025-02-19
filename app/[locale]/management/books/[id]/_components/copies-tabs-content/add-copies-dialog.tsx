"use client"

import React, { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cn } from "@/lib/utils"
import {
  bookEditionAddCopiesSchema,
  type TBookEditionAddCopiesSchema,
} from "@/lib/validations/books/book-editions/add-copies"
import { addCopies } from "@/actions/books/editions/add-copies"
import useConditions from "@/hooks/conditions/use-conditions"
import { toast } from "@/hooks/use-toast"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem } from "@/components/ui/form"

import CopyFields from "./copy-fields"

type Props = { bookId: number; prefix: string }

const createCopy = () => ({
  barcode: "",
  conditionId: 1,
})

function AddCopiesDialog({ bookId, prefix }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const { data: conditions, isFetching: isFetchingConditions } = useConditions()

  const form = useForm<z.infer<typeof bookEditionAddCopiesSchema>>({
    resolver: zodResolver(bookEditionAddCopiesSchema),
    defaultValues: {
      bookEditionCopies: [createCopy()],
    },
  })

  function onSubmit(values: TBookEditionAddCopiesSchema) {
    startTransition(async () => {
      values.bookEditionCopies = values.bookEditionCopies.map((c) => ({
        ...c,
        barcode: prefix + c.barcode,
      }))

      const res = await addCopies({ ...values, bookId })
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

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger disabled={isPending}>
        <div className={cn(buttonVariants())}>
          <Plus />
          {t("Add copies")}
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        {isFetchingConditions ? (
          <div className="flex w-full justify-center">
            <Loader2 className="size-9 animate-spin" />
          </div>
        ) : (
          <DialogHeader>
            <DialogTitle>{t("Edit copies")}</DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="bookEditionCopies"
                    render={({ field: _ }) => (
                      <FormItem className="flex flex-col">
                        <CopyFields
                          form={form}
                          isPending={isPending}
                          conditions={conditions!}
                        />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddCopiesDialog
