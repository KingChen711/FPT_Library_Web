/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import {
  parseQueryDateRange,
  parseQueryNumRange,
  parseSearchParamsDateRange,
  parseSearchParamsNumRange,
} from "@/lib/filters"
import { ETrackingStatus, ETrackingType } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterTrackingSchema,
  type TFilterTrackingSchema,
} from "@/lib/validations/trackings/search-trackings"
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
import NumRangeFilter from "@/components/form/num-range-filter"
import SelectEnumFilter from "@/components/form/select-enum-filter"

function FiltersTrackingsDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("TrackingsManagementPage")
  const tTrackingStatus = useTranslations("Badges.TrackingStatus")
  const tTrackingType = useTranslations("Badges.TrackingType")

  const searchParams = useSearchParams()

  const form = useForm<TFilterTrackingSchema>({
    resolver: zodResolver(filterTrackingSchema),
    defaultValues: {
      actualReturnDateRange: parseSearchParamsDateRange(
        searchParams.getAll("actualReturnDateRange")
      ),
      createdAtRange: parseSearchParamsDateRange(
        searchParams.getAll("createdAtRange")
      ),
      entryDateRange: parseSearchParamsDateRange(
        searchParams.getAll("entryDateRange")
      ),
      expectedReturnDateRange: parseSearchParamsDateRange(
        searchParams.getAll("expectedReturnDateRange")
      ),
      updatedAtRange: parseSearchParamsDateRange(
        searchParams.getAll("updatedAtRange")
      ),

      totalAmountRange: parseSearchParamsNumRange(
        searchParams.getAll("totalAmountRange")
      ),
      totalItemRange: parseSearchParamsNumRange(
        searchParams.getAll("totalItemRange")
      ),

      status: searchParams.get("status") || undefined,
      trackingType: searchParams.get("trackingType") || undefined,
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
    setOpen(false)
    router.push("/management/trackings")
  }

  const wTrackingType = form.watch("trackingType")
  const wStatus = form.watch("status")

  const onSubmit = async (values: TFilterTrackingSchema) => {
    setOpen(false)

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        trackingType: values.trackingType || null,
        status: values.status || null,
        actualReturnDateRange: parseQueryDateRange(
          values.actualReturnDateRange
        ),
        createdAtRange: parseQueryDateRange(values.createdAtRange),
        updatedAtRange: parseQueryDateRange(values.updatedAtRange),
        expectedReturnDateRange: parseQueryDateRange(
          values.expectedReturnDateRange
        ),
        entryDateRange: parseQueryDateRange(values.entryDateRange),
        totalAmountRange: parseQueryNumRange(values.totalAmountRange),
        totalItemRange: parseQueryNumRange(values.totalItemRange),
      },
    })

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

      <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Filters trackings")}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Status")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wStatus}
                        onChange={field.onChange}
                        enumObj={ETrackingStatus}
                        tEnum={tTrackingStatus}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trackingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Tracking type")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wTrackingType}
                        onChange={field.onChange}
                        enumObj={ETrackingType}
                        tEnum={tTrackingType}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalItemRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Total item")}</FormLabel>
                      <FormControl>
                        <NumRangeFilter
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalAmountRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Total amount")}</FormLabel>
                      <FormControl>
                        <NumRangeFilter
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entryDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Entry date")}</FormLabel>
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

                <FormField
                  control={form.control}
                  name="expectedReturnDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Expected return date")}</FormLabel>
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

                <FormField
                  control={form.control}
                  name="actualReturnDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Actual return date")}</FormLabel>
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

                <FormField
                  control={form.control}
                  name="createdAtRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Created at")}</FormLabel>
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

                <FormField
                  control={form.control}
                  name="updatedAtRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Updated at")}</FormLabel>
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
                  <Button type="submit" className="float-right mt-4">
                    {t("Apply")}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default FiltersTrackingsDialog
