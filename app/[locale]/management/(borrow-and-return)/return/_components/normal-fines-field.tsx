import { useEffect } from "react"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import { type Fine } from "@/lib/types/models"
import { type TProcessReturnSchema } from "@/lib/validations/borrow-records/process-return"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import SelectFinesDialog from "./select-fines-dialog"

type Props = {
  form: UseFormReturn<TProcessReturnSchema>
  isPending: boolean
  itemIndex: number
  scanned: boolean
  notShow: boolean
}

function NormalFinesField({
  form,
  isPending,
  itemIndex,
  scanned,
  notShow,
}: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const { fields, replace, remove } = useFieldArray({
    name: `borrowRecordDetails.${itemIndex}.fines`,
    control: form.control,
  })

  useEffect(() => {
    console.log({ scanned })

    if (scanned) {
      form.setValue(`borrowRecordDetails.${itemIndex}.isLost`, false)
      form.setValue(`borrowRecordDetails.${itemIndex}.scanned`, true)
    }
  }, [scanned, form, itemIndex])

  const wIsLost = form.watch(`borrowRecordDetails.${itemIndex}.isLost`)
  const wIOverdue = form.watch(`borrowRecordDetails.${itemIndex}.isOverdue`)
  const wScanned = form.watch(`borrowRecordDetails.${itemIndex}.scanned`)
  const isNeedConfirm = form.watch(`isNeedConfirm`)

  useEffect(() => {
    if (!isNeedConfirm) return

    const needConfirmMissing = form
      .watch("borrowRecordDetails")
      .some(
        (record) =>
          (record.isOverdue || record.isInLibrary) &&
          !record.isLost &&
          !record.scanned
      )

    if (!needConfirmMissing) {
      form.setValue("isNeedConfirm", false)
      form.setValue("isConfirmMissing", false)
      form.clearErrors("isConfirmMissing")
    }
  }, [wIsLost, wScanned, isNeedConfirm, form])

  if (notShow) return null

  return (
    <FormField
      control={form.control}
      name={`borrowRecordDetails.${itemIndex}.fines`}
      render={() => (
        <FormItem>
          <div className="flex items-center justify-between gap-4">
            <FormLabel>
              {t("Fines")}
              <span className="ml-1 text-xl font-bold leading-none text-primary">
                *
              </span>
            </FormLabel>
          </div>
          <FormControl>
            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`borrowRecordDetails.${itemIndex}.fines.${index}.fineNote`}
                    render={() => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="line-clamp-1 flex h-9 select-none items-center rounded-md border px-3 text-sm">
                            {
                              (
                                form.watch(
                                  `borrowRecordDetails.${itemIndex}.fines.${index}.fine`
                                ) as Fine
                              ).description
                            }
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`borrowRecordDetails.${itemIndex}.fines.${index}.fineNote`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("fineNote")}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      remove(index)
                    }}
                    variant="outline"
                    size="icon"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage />
          <SelectFinesDialog
            isLost={wIsLost}
            isOverdue={wIOverdue}
            disabled={isPending}
            disableFineIds={fields.map((f) => f.finePolicyId)}
            onSelect={(fine) => {
              // The business rule is changed, 0 or 1 fine can be attach for each return item
              replace([
                {
                  fine: fine,
                  finePolicyId: fine.finePolicyId,
                },
              ])
            }}
          />
        </FormItem>
      )}
    />
  )
}

export default NormalFinesField
