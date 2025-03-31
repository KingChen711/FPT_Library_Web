import React, { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { type TProcessReturnSchema } from "@/lib/validations/borrow-records/process-return"
import useConditions from "@/hooks/conditions/use-conditions"
import { Button } from "@/components/ui/button"
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

type Props = {
  form: UseFormReturn<TProcessReturnSchema>
  itemIndex: number
  isPending: boolean
}

function ConditionField({ form, itemIndex, isPending }: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const [openComboboxCondition, setOpenComboboxCondition] = useState(false)
  const { data: conditionItems } = useConditions()
  const locale = useLocale()

  return (
    <FormField
      control={form.control}
      name={`borrowRecordDetails.${itemIndex}.returnConditionId`}
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
            <PopoverTrigger asChild disabled={isPending}>
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
                          (condition) => condition.conditionId === field.value
                        )?.vietnameseName
                      : conditionItems?.find(
                          (condition) => condition.conditionId === field.value
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
                            `borrowRecordDetails.${itemIndex}.returnConditionId`,
                            condition.conditionId
                          )
                          form.clearErrors(
                            `borrowRecordDetails.${itemIndex}.returnConditionId`
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
  )
}

export default ConditionField
