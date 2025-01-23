"use client"

import React, { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EBookCopyConditionStatus } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import {
  bookEditionAddCopiesSchema,
  type TBookEditionAddCopiesSchema,
} from "@/lib/validations/books/book-editions/add-copies"
import { addCopies } from "@/actions/books/editions/add-copies"
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

type Props = { editionId: number; bookId: number }

const createCopy = () => ({
  barcode: "",
  conditionStatus: EBookCopyConditionStatus.GOOD,
})

function AddCopiesDialog({ editionId, bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof bookEditionAddCopiesSchema>>({
    resolver: zodResolver(bookEditionAddCopiesSchema),
    defaultValues: {
      bookEditionCopies: [createCopy()],
    },
  })

  function onSubmit(values: TBookEditionAddCopiesSchema) {
    startTransition(async () => {
      const res = await addCopies({ ...values, editionId, bookId })
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
                      <CopyFields form={form} isPending={isPending} />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>

        {/* <Dialog open={openWarning} onOpenChange={setOpenWarning}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t(
                  "Are you sure you want to set the status of this copy to WornDamage"
                )}
              </DialogTitle>
              <DialogDescription>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpenWarning(false)
                    }}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    className="ml-4"
                    onClick={() => {
                      setOpenWarning(false)
                      setHasConfirmedAboutChangeStatus(true)
                      setInputs((prev) => {
                        const clone = structuredClone(prev)
                        clone.forEach((item) => {
                          if (item.id !== tempChangedCopy?.inputId) return
                          item.conditionStatus = tempChangedCopy.val
                        })
                        return clone
                      })
                      // setTempChangedCopy(null)
                    }}
                  >
                    {t("Yes")}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog> */}
      </DialogContent>
    </Dialog>
  )
}

export default AddCopiesDialog
