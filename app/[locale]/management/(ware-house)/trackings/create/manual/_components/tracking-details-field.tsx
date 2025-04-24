import React, { useCallback } from "react"
import { Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import { EStockTransactionType } from "@/lib/types/enums"
import { type Category } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { type TCreateTrackingManualSchema } from "@/lib/validations/trackings/create-tracking-manual"
import useGetItemByISBN from "@/hooks/library-items/use-get-item-by-isbn"
import useBarcodeScanner from "@/hooks/use-barcode-scanner"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import FastInputDialog from "./fast-input-dialog"
import TrackingDetailRowField from "./tracking-detail-row-field"

const createNewTrackingDetail = (
  type: EStockTransactionType.ADDITIONAL | EStockTransactionType.NEW
) => {
  return {
    itemName: "",
    isbn: "",
    itemTotal: 0,
    unitPrice: 0,
    totalAmount: 0,
    stockTransactionType: type, //only NEW
  }
}

type Props = {
  form: UseFormReturn<TCreateTrackingManualSchema>
  isPending: boolean
  selectedCategories: (Category | null)[]
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<(Category | null)[]>
  >
}

function TrackingDetailsField({
  form,
  isPending,
  selectedCategories,
  setSelectedCategories,
}: Props) {
  const locale = useLocale()
  const { mutateAsync: getItemByISBN, isPending: fetchingItem } =
    useGetItemByISBN()
  const { fields, append, remove, replace } = useFieldArray({
    name: "warehouseTrackingDetails",
    control: form.control,
  })

  const totalItem = form.watch("totalItem") || 0

  const handleBarcodeData = useCallback(
    (scannedData: string) => {
      if (fetchingItem) return

      const isExist = fields.some((f) => f.isbn === scannedData)
      if (isExist) {
        toast({
          title: locale === "vi" ? "Thất bại" : "Fail",
          description:
            locale === "vi"
              ? "Tài liệu này đã được quét"
              : "Library item is already scanned",
          variant: "warning",
        })
      }

      getItemByISBN(scannedData, {
        onSuccess: (data) => {
          if (data) {
            append({
              categoryId: data.categoryId,
              conditionId: 1,
              itemName: data.title,
              itemTotal: 0,
              stockTransactionType: EStockTransactionType.ADDITIONAL,
              unitPrice: data.estimatedPrice || 0,
              isbn: data.isbn || "",
              totalAmount: 0,
              libraryItemId: data.libraryItemId,
            })
            form.setValue("totalItem", totalItem + 1)
          } else {
            toast({
              title: locale === "vi" ? "Thất bại" : "Fail",
              description:
                locale === "vi"
                  ? "Tài liệu chưa tồn tại trong hệ thống"
                  : "Library item does not exist in the system",
              variant: "warning",
            })
          }
        },
      })
    },
    [append, fetchingItem, getItemByISBN, locale, fields, form, totalItem]
  )

  useBarcodeScanner(handleBarcodeData)

  const t = useTranslations("TrackingsManagementPage")

  const watchTrackingDetails = form.watch("warehouseTrackingDetails") || []

  const handleGlobalCalculate = () => {
    let totalAmount = 0
    watchTrackingDetails.forEach((detail) => {
      totalAmount += (detail.unitPrice || 0) * (detail.itemTotal || 0)
    })
    form.setValue(`totalAmount`, totalAmount)
  }

  return (
    <FormField
      control={form.control}
      name="warehouseTrackingDetails"
      render={() => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>
              {t("Tracking details")}{" "}
              <span className="ml-1 text-xl font-bold leading-none text-primary">
                *
              </span>
            </FormLabel>
            <div className="flex flex-wrap items-center gap-4">
              <FastInputDialog append={append} replace={replace} form={form} />
            </div>
          </div>
          <FormControl>
            <div className="mt-4 grid w-full">
              <div className="overflow-x-auto rounded-md">
                {fields.length > 0 && (
                  <Table className="overflow-hidden">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-nowrap border font-bold">
                          <div className="flex justify-center">
                            {t("Stock transaction type")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap border font-bold">
                          {t("Library item")}
                        </TableHead>
                        {/* <TableHead className="text-nowrap border font-bold">
                        {t("Item name")}
                      </TableHead> */}
                        <TableHead className="text-nowrap border font-bold">
                          <div className="flex justify-center">ISBN</div>
                        </TableHead>
                        <TableHead className="text-nowrap border font-bold">
                          <div className="flex justify-center">
                            {t("Category")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap border font-bold">
                          <div className="flex justify-center">
                            {t("Condition")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap border font-bold">
                          <div className="flex justify-center">
                            {t("Item total")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap border font-bold">
                          <div className="flex justify-center">
                            {t("Unit price")}
                          </div>
                        </TableHead>
                        <TableHead className="text-nowrap border font-bold">
                          <div className="flex justify-center">
                            {t("Total amount auto")}
                          </div>
                        </TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TrackingDetailRowField
                          key={field.id}
                          field={field}
                          form={form}
                          index={index}
                          isPending={isPending}
                          onRemove={() => {
                            remove(index)
                            setSelectedCategories((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }}
                          category={selectedCategories[index]}
                          setCategory={(val) => {
                            setSelectedCategories((prev) =>
                              prev.map((old, i) => (i === index ? val : old))
                            )
                          }}
                          onGlobalCalculate={handleGlobalCalculate}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-start gap-4",
                    fields.length > 0 && "mt-4"
                  )}
                >
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      append(createNewTrackingDetail(EStockTransactionType.NEW))
                      form.setValue("totalItem", totalItem + 1)
                      setSelectedCategories((prev) => [...prev, null])
                    }}
                    disabled={isPending}
                    variant="outline"
                  >
                    <Plus />
                    {t("New item")}
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      append(
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
                        createNewTrackingDetail(
                          EStockTransactionType.ADDITIONAL
                        )
                      )
                      setSelectedCategories((prev) => [...prev, null])
                      form.setValue("totalItem", totalItem + 1)
                    }}
                    disabled={isPending}
                    variant="outline"
                  >
                    <Plus />
                    {t("Additional item")}
                  </Button>
                </div>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default TrackingDetailsField
