import React from "react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"
import { type z } from "zod"

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

import { type editBarcodeSchema } from "./copy-dropdown"

type Props = {
  handleEditBarcode: (values: z.infer<typeof editBarcodeSchema>) => void
  isPending: boolean
  open: boolean
  setOpen: (val: boolean) => void
  form: UseFormReturn<z.infer<typeof editBarcodeSchema>>
}

function EditBarcodeDialog({
  handleEditBarcode,
  isPending,
  open,
  setOpen,
  form,
}: Props) {
  const t = useTranslations("BooksManagementPage")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">{t("Edit barcode")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleEditBarcode)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Barcode")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={isPending} className="flex-1">
                    {t("Save")}
                    {isPending && (
                      <Loader2 className="ml-2 size-4 animate-spin" />
                    )}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setOpen(false)
                    }}
                    variant="secondary"
                  >
                    {t("Cancel")}
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

export default EditBarcodeDialog
