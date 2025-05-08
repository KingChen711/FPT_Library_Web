import React from "react"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  useFieldArray,
  type UseFieldArrayAppend,
  type UseFormReturn,
} from "react-hook-form"

import { type Category } from "@/lib/types/models"
import {
  ESupplementRequestItemType,
  type TCreateSupplementRequestSchema,
} from "@/lib/validations/supplement/create-supplement-request"
import { type TDashboardTopCirculation } from "@/hooks/dash-board/use-dashboard-top-circulation"
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

import SelectTopCirculationDialog from "./select-top-circulation-dialog"
import TrackingDetailRowField from "./tracking-detail-row-field"

type Props = {
  form: UseFormReturn<TCreateSupplementRequestSchema>
  isPending: boolean
  selectedCategories: (Category | null)[]
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<(Category | null)[]>
  >
  recommendAppend: UseFieldArrayAppend<
    TCreateSupplementRequestSchema,
    "supplementRequestDetails"
  >
}

function TrackingDetailsField({
  form,
  isPending,
  selectedCategories,
  setSelectedCategories,
  recommendAppend,
}: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const { fields, append, remove } = useFieldArray({
    name: "warehouseTrackingDetails",
    control: form.control,
  })

  const watchTrackingDetails = form.watch("warehouseTrackingDetails") || []

  const handleGlobalCalculate = () => {
    let totalAmount = 0

    watchTrackingDetails.forEach((detail) => {
      totalAmount += (detail.unitPrice || 0) * (detail.itemTotal || 0)
    })
    form.setValue(`totalAmount`, totalAmount)
    if (totalAmount > 0) form.clearErrors("totalAmount")
  }

  const watchGlobalTotalItem = form.watch("totalItem") || 0

  const wItemIds = form
    .watch("warehouseTrackingDetails")
    .map((i) => i.libraryItemId)
    .filter(Boolean) as number[]

  const wSupplementItemIds = form
    .watch("supplementRequestDetails")
    .map((i) => i.id)

  const handleSelectTopItem = (
    item: TDashboardTopCirculation["topBorrowItems"]["sources"][number]
  ) => {
    form.setValue("totalItem", watchGlobalTotalItem + 1)

    setSelectedCategories((prev) => [...prev, item.libraryItem.category])
    append({
      type: ESupplementRequestItemType.TOP_CIRCULATION,
      itemName: item.libraryItem.title,
      availableUnits: item.availableVsNeedChart.availableUnits,
      needUnits: item.availableVsNeedChart.needUnits,
      borrowFailedCount: item.borrowFailedCount,
      borrowSuccessCount: item.borrowSuccessCount,
      borrowRequestCount: item.borrowRequestCount,
      categoryId: item.libraryItem.categoryId,
      libraryItemId: item.libraryItem.libraryItemId,
      totalSatisfactionUnits: item.totalSatisfactionUnits,
      unitPrice: item.libraryItem.estimatedPrice || 0,
      isbn: item.libraryItem.isbn || "",
      hasInitPrice: !!item.libraryItem.estimatedPrice,
      conditionId: 1,
      averageNeedSatisfactionRate:
        item.availableVsNeedChart.averageNeedSatisfactionRate,
      itemTotal: 0,
      totalAmount: 0,
      supplementRequestReason: "",
      borrowExtensionRate: item.borrowExtensionRate,
    })
  }

  return (
    <FormField
      control={form.control}
      name="warehouseTrackingDetails"
      render={() => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>
              {t("Supplement details")}{" "}
              <span className="ml-1 text-xl font-bold leading-none text-primary">
                *
              </span>
            </FormLabel>
            {/* <div className="flex flex-wrap items-center gap-4">
              <FastInputDialog append={append} replace={replace} form={form} />
            </div> */}
          </div>
          <FormControl>
            <div className="mt-4 grid w-full">
              <div className="overflow-x-auto rounded-md">
                {fields.length > 0 && (
                  <Table className="overflow-hidden border">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-nowrap border font-bold">
                          {t("Type")}
                        </TableHead>
                        <TableHead className="text-nowrap border font-bold">
                          {t("Library item")}
                        </TableHead>
                        <TableHead className="text-nowrap border font-bold">
                          <div className="flex justify-center">ISBN</div>
                        </TableHead>
                        <TableHead className="text-nowrap border font-bold">
                          <div className="flex justify-center">
                            {t("Category")}
                          </div>
                        </TableHead>
                        {/* <TableHead className="text-nowrap border font-bold">
                        <div className="flex justify-center">
                          {t("Condition")}
                        </div>
                      </TableHead> */}
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
                        <TableHead className="text-nowrap border font-bold">
                          <div className="flex justify-center">
                            {t("Supplement request reason")}
                          </div>
                        </TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TrackingDetailRowField
                          recommendAppend={recommendAppend}
                          wSupplementItemIds={wSupplementItemIds}
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
                <div className="my-4 flex flex-wrap items-center justify-start gap-4">
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      append({
                        type: ESupplementRequestItemType.CUSTOM,
                        itemName: "",
                        availableUnits: undefined,
                        needUnits: undefined,
                        borrowFailedCount: undefined,
                        satisfactionRate: undefined,
                        borrowSuccessCount: undefined,
                        borrowRequestCount: undefined,
                        totalSatisfactionUnits: undefined,
                        borrowExtensionRate: undefined,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
                        categoryId: undefined,
                        libraryItemId: undefined,
                        unitPrice: 0,
                        isbn: "",
                        hasInitPrice: true,

                        conditionId: 1,
                        averageNeedSatisfactionRate: undefined,
                        itemTotal: 0,
                        totalAmount: 0,
                        supplementRequestReason: "",
                      })
                      form.setValue("totalItem", watchGlobalTotalItem + 1)
                      setSelectedCategories((prev) => [...prev, null])
                    }}
                    disabled={isPending}
                    variant="outline"
                  >
                    <Plus />
                    {t("Add custom item")}
                  </Button>
                  <SelectTopCirculationDialog
                    selectedItemIds={wItemIds}
                    onSelect={handleSelectTopItem}
                  />
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
