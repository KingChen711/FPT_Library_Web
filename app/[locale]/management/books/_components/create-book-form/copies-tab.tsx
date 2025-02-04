import React, { useRef } from "react"
import { Printer } from "lucide-react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"
import { useReactToPrint } from "react-to-print"

import { type Category } from "@/lib/types/models"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import BookConditionStatusBadge from "@/components/ui/book-condition-status-badge"
import { Button } from "@/components/ui/button"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"

import { BarcodesContainer } from "./barcodes-container"
import BookCopiesDialog from "./book-copies-dialog"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
  show: boolean
  selectedCategory: Category | null
  hasConfirmedChangeStatus: boolean
  setHasConfirmedChangeStatus: (val: boolean) => void
}

export default function CopiesTab({
  form,
  isPending,
  show,
  selectedCategory,
  hasConfirmedChangeStatus,
  setHasConfirmedChangeStatus,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const barcodesPrintRef = useRef<HTMLDivElement>(null)
  const handlePrintBarcodes = useReactToPrint({
    contentRef: barcodesPrintRef,
  })

  if (!show) return null

  return (
    <>
      <FormField
        control={form.control}
        name="libraryItemInstances"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <div className="flex items-center gap-2">
              <FormLabel>
                {t("Book copies")}
                <span className="ml-1 text-xl font-bold leading-none text-primary">
                  *
                </span>
              </FormLabel>
              <BookCopiesDialog
                form={form}
                isPending={isPending}
                prefix={selectedCategory?.prefix || ""}
                hasConfirmedChangeStatus={hasConfirmedChangeStatus}
                setHasConfirmedChangeStatus={setHasConfirmedChangeStatus}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {field.value.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  {t("Empty copies")}
                </div>
              )}
              {field.value.map((bc) => (
                <div
                  key={bc.barcode}
                  className="relative flex flex-row items-center gap-x-4 rounded-md border bg-muted px-2 py-1 text-muted-foreground"
                >
                  <div className="flex flex-col text-sm">
                    <div>
                      <strong>{t("Code")}:</strong>{" "}
                      {selectedCategory?.prefix
                        ? selectedCategory.prefix
                        : null}
                      {bc.barcode}
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>{t("Status")}:</strong>
                      <BookConditionStatusBadge status={bc.conditionStatus} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("libraryItemInstances").length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-start">
            <Label>{t("Barcodes")}</Label>
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handlePrintBarcodes()
              }}
              size="icon"
              variant="ghost"
              disabled={isPending}
            >
              <Printer className="text-primary" />
            </Button>
          </div>
          <BarcodesContainer
            ref={barcodesPrintRef}
            form={form}
            prefix={selectedCategory?.prefix || ""}
          />
        </div>
      )}
    </>
  )
}
