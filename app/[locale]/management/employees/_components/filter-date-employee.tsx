"use client"

import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { type TEmployeesFilterSchema } from "@/lib/validations/employee/employees-filter"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

type Props = {
  form: UseFormReturn<TEmployeesFilterSchema, unknown, undefined>
  name: keyof TEmployeesFilterSchema
  label: string
}

const FilterDateEmployee = ({ form, label, name }: Props) => {
  const t = useTranslations("GeneralManagement")

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(label)}</FormLabel>
          <div className="flex w-fit flex-wrap items-center justify-between gap-3">
            <DateTimePicker
              jsDate={field.value[0] || undefined}
              onJsDateChange={(date) =>
                field.onChange([date || null, field.value[1]])
              }
              disabled={(date) =>
                !!field.value[1] && date > new Date(field.value[1])
              }
            />
            <div>-</div>
            <DateTimePicker
              jsDate={field.value[1] || undefined}
              onJsDateChange={(date) =>
                field.onChange([field.value[0], date || null])
              }
              disabled={(date) =>
                !!field.value[0] && date < new Date(field.value[0])
              }
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FilterDateEmployee
