import React, { useEffect } from "react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { EBookCopyConditionStatus } from "@/lib/types/enums"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  index: number
}

function CopyInput({ index, form }: Props) {
  const t = useTranslations("BooksManagementPage")

  const wConditionId = form.watch(`libraryItemInstances.${index}.conditionId`)

  useEffect(() => {
    console.log({ wConditionId })
  }, [wConditionId])

  return (
    <div className="flex w-full gap-2">
      <div className="flex flex-1 items-center gap-2">
        <FormField
          control={form.control}
          name={`libraryItemInstances.${index}.barcode`}
          render={({ field }) => (
            <FormItem className="flex w-1/2 items-center rounded-md border px-3">
              <FormControl>
                <div className="select-none rounded-md p-2">{field.value}</div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`libraryItemInstances.${index}.conditionId`}
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormControl>
                <Select
                  value={field.value.toString()}
                  onValueChange={(val) => field.onChange(+val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className="cursor-pointer" value="1">
                        {t(EBookCopyConditionStatus.GOOD)}
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="3">
                        {t(EBookCopyConditionStatus.WORN)}
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="2">
                        {t(EBookCopyConditionStatus.DAMAGED)}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default CopyInput
