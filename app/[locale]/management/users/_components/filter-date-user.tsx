"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { type TUsersFilterSchema } from "@/lib/validations/user/user-filter"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  form: UseFormReturn<TUsersFilterSchema, unknown, undefined>
  name: keyof TUsersFilterSchema
  label: string
}

const FilterDateUser = ({ form, label, name }: Props) => {
  const t = useTranslations("GeneralManagement")

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(label)}</FormLabel>

          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[200px] pl-3 text-left font-normal",
                      !field.value[0] && "text-muted-foreground"
                    )}
                  >
                    {field.value[0] ? (
                      format(new Date(field.value[0]), "PPP")
                    ) : (
                      <span>{t("pick a date")}</span>
                    )}
                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    field.value[0] ? new Date(field.value[0]) : undefined
                  }
                  onSelect={(date) =>
                    field.onChange([date || null, field.value[1]])
                  }
                  disabled={(date) =>
                    !!field.value[1] && date > new Date(field.value[1])
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div>-</div>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[200px] pl-3 text-left font-normal",
                      !field.value[1] && "text-muted-foreground"
                    )}
                  >
                    {field.value[1] ? (
                      format(new Date(field.value[1]), "PPP")
                    ) : (
                      <span>{t("pick a date")}</span>
                    )}
                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    field.value[1] ? new Date(field.value[1]) : undefined
                  }
                  onSelect={(date) =>
                    field.onChange([field.value[0], date || null])
                  }
                  disabled={(date) =>
                    !!field.value[0] && date < new Date(field.value[0])
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FilterDateUser
