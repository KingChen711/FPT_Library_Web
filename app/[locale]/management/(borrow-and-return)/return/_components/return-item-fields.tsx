import React, { useState } from "react"
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Barcode from "react-barcode"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import { type EBorrowRecordStatus, type EBorrowType } from "@/lib/types/enums"
import {
  type Author,
  type BookEdition,
  type Category,
  type Shelf,
} from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { type TProcessReturnSchema } from "@/lib/validations/borrow-records/process-return"
import useConditions from "@/hooks/conditions/use-conditions"
import LibraryItemCard from "@/components/ui/book-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import BorrowRecordStatusBadge from "@/components/badges/borrow-record-status-badge"
import BorrowTypeBadge from "@/components/badges/borrow-type-bade"

import NormalFinesField from "./normal-fines-field"

type Props = {
  form: UseFormReturn<TProcessReturnSchema>
  isPending: boolean
  borrowingItems: (BookEdition & {
    category: Category
    shelf: Shelf | null
    authors: Author[]
    scanned: boolean
    barcode: string
    instanceId: number
    borrowRecordDetailId: number
    borrowStatus: EBorrowRecordStatus
    borrowType: EBorrowType
  })[]
}

function ReturnItemFields({ form, isPending, borrowingItems }: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const { fields } = useFieldArray({
    name: "borrowRecordDetails",
    control: form.control,
  })

  const locale = useLocale()
  const { data: conditionItems } = useConditions()
  const [openComboboxCondition, setOpenComboboxCondition] = useState(false)

  return (
    <div className="flex flex-col space-y-4">
      {fields.map((field, index) => {
        const item = borrowingItems[index]
        return (
          <div
            key={field.id}
            className={cn(
              "relative flex flex-col gap-4 rounded-lg border bg-card p-4 transition-all",
              item.scanned
                ? "border-2 border-primary/50 shadow-sm"
                : "border-muted"
            )}
          >
            <div className="absolute right-5 top-5 flex items-center gap-4">
              {!item.scanned && (
                <FormField
                  control={form.control}
                  name={`borrowRecordDetails.${index}.isLost`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <FormLabel className="!mt-0">{t("Lost item")}</FormLabel>
                    </FormItem>
                  )}
                />
              )}
              <BorrowTypeBadge status={item.borrowType} />
              <BorrowRecordStatusBadge status={item.borrowStatus} />
            </div>

            <div className="flex items-center gap-6">
              <LibraryItemCard
                libraryItem={item}
                expandable
                className="max-w-full"
              />

              <div className="ml-auto flex w-[370px] shrink-0 items-center justify-between gap-6">
                <div className="flex w-[106px] justify-center">
                  {item.scanned ? (
                    <div className="flex flex-col items-center">
                      <ArrowRight className="size-10 text-primary" />
                      <span className="mt-1 text-nowrap text-xs font-medium text-primary">
                        {t("Scanned")}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
                      <div className="size-2 animate-pulse rounded-full bg-warning"></div>
                      <span className="text-nowrap text-sm font-medium text-muted-foreground">
                        {t("Not scanned yet")}
                      </span>
                    </div>
                  )}
                </div>
                {item.barcode && (
                  <div className="rounded-md border border-primary/20 bg-white p-2 shadow-sm">
                    <div className="flex flex-col items-center justify-center">
                      <Barcode
                        value={item.barcode}
                        width={2}
                        height={48}
                        fontSize={20}
                        fontOptions="bold"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {(item.scanned ||
              form.watch(`borrowRecordDetails.${index}.isLost`)) && (
              <>
                {!form.watch(`borrowRecordDetails.${index}.isLost`) && (
                  <FormField
                    control={form.control}
                    name={`borrowRecordDetails.${index}.returnConditionId`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          {t("Return condition")}
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </FormLabel>
                        <Popover
                          open={openComboboxCondition}
                          onOpenChange={setOpenComboboxCondition}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-40 justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? locale === "vi"
                                    ? conditionItems?.find(
                                        (condition) =>
                                          condition.conditionId === field.value
                                      )?.vietnameseName
                                    : conditionItems?.find(
                                        (condition) =>
                                          condition.conditionId === field.value
                                      )?.englishName
                                  : t("Select condition")}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent side="top" className="p-0">
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {conditionItems?.map((condition) => (
                                    <CommandItem
                                      value={
                                        locale === "vi"
                                          ? condition.vietnameseName
                                          : condition.englishName
                                      }
                                      key={condition.conditionId}
                                      onSelect={() => {
                                        form.setValue(
                                          `borrowRecordDetails.${index}.returnConditionId`,
                                          condition.conditionId
                                        )
                                        form.clearErrors(
                                          `borrowRecordDetails.${index}.returnConditionId`
                                        )
                                        setOpenComboboxCondition(false)
                                      }}
                                    >
                                      {locale === "vi"
                                        ? condition.vietnameseName
                                        : condition.englishName}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          condition.conditionId === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <NormalFinesField
                  scanned={item.scanned}
                  form={form}
                  isPending={isPending}
                  itemIndex={index}
                />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ReturnItemFields
