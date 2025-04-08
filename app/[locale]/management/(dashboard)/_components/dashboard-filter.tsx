/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { parseQueryDateRange, parseSearchParamsDateRange } from "@/lib/filters"
import { EDashboardPeriodLabel } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  dashboardFilterSchema,
  type TDashboardFilterSchema,
} from "@/lib/validations/dashboard/dashboard-filer"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import DateRangePickerFilter from "@/components/form/date-range-picker-filter"
import SelectEnumFilter from "@/components/form/select-enum-filter"

function DashboardFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("Dashboard")
  const tPeriod = useTranslations("Badges.DashboardPeriodLabel")
  const form = useForm<TDashboardFilterSchema>({
    resolver: zodResolver(dashboardFilterSchema),
    defaultValues: {
      dateRange: parseSearchParamsDateRange(searchParams.getAll("dateRange")),
      period:
        searchParams.get("period") || EDashboardPeriodLabel.DAILY.toString(),
    },
  })

  const resetFilters = () => {
    Object.keys(form.getValues()).forEach((key) => {
      form.setValue(
        //@ts-ignore
        key,
        //@ts-ignore
        Array.isArray(form.getValues()[key]) ? [null, null] : undefined
      )
    })
    form.setValue("period", EDashboardPeriodLabel.DAILY.toString())
    setOpen(false)

    router.push("/management")
  }

  const wPeriod = form.watch("period")

  const onSubmit = async (values: TDashboardFilterSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        period: values.period || null,
        dateRange: parseQueryDateRange(values.dateRange),
      },
    })

    setOpen(false)
    router.replace(newUrl, { scroll: false })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-full rounded-l-none" variant="outline">
          <Filter />

          {t("Filters")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Filters")}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-2 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="period"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("Period")}</FormLabel>
                        <SelectEnumFilter
                          //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                          value={wPeriod}
                          onChange={field.onChange}
                          enumObj={EDashboardPeriodLabel}
                          tEnum={tPeriod}
                          noAll
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("Date range")}</FormLabel>
                        <FormControl>
                          <DateRangePickerFilter
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div className="flex justify-end gap-x-4">
                <DialogClose asChild>
                  <Button variant="secondary" className="float-right mt-4">
                    {t("Cancel")}
                  </Button>
                </DialogClose>
                <Button
                  variant="secondary"
                  className="float-right mt-4"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    resetFilters()
                  }}
                >
                  {t("Reset")}
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  className="float-right mt-4"
                >
                  {t("Apply")}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default DashboardFilter
