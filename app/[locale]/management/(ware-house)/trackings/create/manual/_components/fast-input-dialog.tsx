import React, { useState, useTransition } from "react"
import { DialogClose } from "@radix-ui/react-dialog"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  type UseFieldArrayAppend,
  type UseFieldArrayReplace,
  type UseFormReturn,
} from "react-hook-form"

import { http } from "@/lib/http"
import { EStockTransactionType } from "@/lib/types/enums"
import { type LibraryItem } from "@/lib/types/models"
import { type TCreateTrackingManualSchema } from "@/lib/validations/trackings/create-tracking-manual"
import useCategories from "@/hooks/categories/use-categories"
import useConditions from "@/hooks/conditions/use-conditions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

type XXX = {
  itemName: string
  isbn: string | undefined
  itemTotal: number
  unitPrice: number
  totalAmount: number
  categoryId: number
  conditionId: number
  stockTransactionType: EStockTransactionType
  libraryItemId: number | undefined
}

type Props = {
  form: UseFormReturn<TCreateTrackingManualSchema>
  append: UseFieldArrayAppend<
    TCreateTrackingManualSchema,
    "warehouseTrackingDetails"
  >
  replace: UseFieldArrayReplace<
    TCreateTrackingManualSchema,
    "warehouseTrackingDetails"
  >
}

function FastInputDialog({ replace, form }: Props) {
  const t = useTranslations("TrackingsManagementPage")

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")

  const [isPending, startTransition] = useTransition()

  const { data: categoryItems, isLoading: loadingCategories } = useCategories()
  const { data: conditionItems, isLoading: loadingConditions } = useConditions()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  async function parseInput(): Promise<XXX[]> {
    if (!input || !categoryItems || !conditionItems!) return []
    // Split input into lines
    const lines = input.trim().split("\n")

    // Process each line
    let items: XXX[] = lines
      .map((line) => {
        try {
          const parts = line.split(/\t+/) // Split by tab or spaces

          if (parts.length < 7 || parts.length > 8) {
            throw new Error(`Invalid format for line: "${line}"`)
          }

          const additionIndex = parts.length === 7 ? 0 : 1

          const itemName = parts[0].replaceAll("\r", "")
          const isbn =
            parts.length === 8 ? parts[1].replaceAll("\r", "") : undefined

          const itemTotal =
            Number(parts[1 + additionIndex].replaceAll("\r", "")) || 0
          const unitPrice =
            Number(
              parts[2 + additionIndex]
                .replaceAll("\r", "")
                .replaceAll(".", "")
                .replaceAll(",", "")
            ) || 0
          const totalAmount =
            Number(
              parts[3 + additionIndex]
                .replaceAll("\r", "")
                .replaceAll(".", "")
                .replaceAll(",", "")
            ) || 0
          const conditionId =
            conditionItems.find((c) => {
              const conditionText = parts[5 + additionIndex]
                ?.replace("\r", "")
                .toLowerCase()
              return (
                c.englishName.toLowerCase() === conditionText ||
                c.vietnameseName.toLowerCase() === conditionText
              )
            })?.conditionId ||
            (() => {
              throw new Error(`Invalid condition for line: "${line}"`)
            })()

          const categoryId =
            categoryItems.find((c) => {
              const categoryText = parts[4 + additionIndex]
                ?.replace("\r", "")
                .toLowerCase()
              return (
                c.englishName.toLowerCase() === categoryText ||
                c.vietnameseName.toLowerCase() === categoryText
              )
            })?.categoryId ||
            (() => {
              throw new Error(`Invalid category for line: "${line}"`)
            })()

          const stockTransactionType = (() => {
            const stockTypeText = parts[6 + additionIndex]
              ?.replace("\r", "")
              .toLowerCase()
            if (stockTypeText.toLowerCase() === "Nhập mới".toLowerCase())
              return EStockTransactionType.NEW
            if (stockTypeText.toLowerCase() === "Nhập bổ sung".toLowerCase())
              return EStockTransactionType.ADDITIONAL
            throw new Error(`Invalid category for line: "${line}"`)
          })()

          return {
            itemName,
            isbn,
            itemTotal,
            unitPrice,
            totalAmount,
            conditionId,
            categoryId,
            stockTransactionType,
            libraryItemId: undefined as number | undefined,
          }
        } catch {
          return null
        }
      })
      .filter((i) => i !== null)

    const getLibraryItemPromises: Promise<XXX>[] = items.map(async (item) => {
      if (!item.isbn) return item

      try {
        const { data } = await http.get<LibraryItem>(
          `/api/library-items/get-by-isbn?isbn=${item.isbn}`
        )
        if (!data)
          return { ...item, stockTransactionType: EStockTransactionType.NEW }
        return {
          ...item,
          stockTransactionType: EStockTransactionType.ADDITIONAL,
          categoryId: data.categoryId,
          itemName: data.title,
          libraryItemId: data.libraryItemId as number | undefined,
          unitPrice: data.estimatedPrice || item.unitPrice,
          totalAmount:
            (Number(data.estimatedPrice) || 0) * (Number(item.itemTotal) || 0),
        }
      } catch {
        return { ...item, stockTransactionType: EStockTransactionType.NEW }
      }
    })

    items = await Promise.all(getLibraryItemPromises)

    return items
  }

  const handleSubmit = () => {
    startTransition(async () => {
      const items = await parseInput()

      console.log(items)

      const isbns = items.map((i) => i.isbn)

      const availableItems = form
        .watch("warehouseTrackingDetails")
        .filter((d) => !d.isbn || !isbns.includes(d.isbn))

      replace([...availableItems, ...items])
      form.setValue("totalItem", availableItems.length + items.length)
      setInput("")
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("Fast input")}</Button>
      </DialogTrigger>
      <DialogContent>
        {loadingCategories || loadingConditions ? (
          <div className="flex w-full justify-center">
            <Loader2 className="size-9 animate-spin" />
          </div>
        ) : (
          <DialogHeader>
            <DialogTitle className="mb-2">{t("Fast input")}</DialogTitle>
            <DialogDescription asChild>
              <div>
                <div className="flex flex-col gap-2">
                  <FormLabel>{t("Excel content")}</FormLabel>
                  <FormControl>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isPending}
                      rows={10}
                    />
                  </FormControl>
                  <FormMessage />
                </div>

                <div className="mt-4 flex justify-end gap-4">
                  <DialogClose asChild>
                    <Button disabled={isPending} variant="outline">
                      {t("Cancel")}
                    </Button>
                  </DialogClose>
                  <Button disabled={isPending} onClick={handleSubmit}>
                    {t("Confirm")}
                    {isPending && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default FastInputDialog
