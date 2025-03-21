"use client"

import { getLocalTimeZone } from "@internationalized/date"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { type TEmployeesFilterSchema } from "@/lib/validations/employee/employees-filter"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  createCalendarDate,
  DateTimePicker,
} from "@/components/form/date-time-picker"

type Props = {
  form: UseFormReturn<TEmployeesFilterSchema, unknown, undefined>
  name: keyof TEmployeesFilterSchema
  label: string
}

const FilterDateEmployee = ({ form, label, name }: Props) => {
  const t = useTranslations("GeneralManagement")
  const timezone = getLocalTimeZone()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(label)}</FormLabel>
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <div className="flex-1">
              <DateTimePicker
                value={createCalendarDate(field.value[0])}
                onChange={(date) =>
                  field.onChange([
                    date ? date.toDate(timezone) : null,
                    field.value[1],
                  ])
                }
                disabled={(date) =>
                  !!field.value[1] && date > new Date(field.value[1])
                }
              />
            </div>
            <div>-</div>
            <div className="flex-1">
              <DateTimePicker
                value={createCalendarDate(field.value[1])}
                onChange={(date) =>
                  field.onChange([
                    field.value[0],
                    date ? date.toDate(timezone) : null,
                  ])
                }
                disabled={(date) =>
                  !!field.value[0] && date < new Date(field.value[0])
                }
              />
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FilterDateEmployee
