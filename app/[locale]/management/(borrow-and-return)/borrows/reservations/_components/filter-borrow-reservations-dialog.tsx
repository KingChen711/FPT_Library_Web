/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { parseQueryDateRange, parseSearchParamsDateRange } from "@/lib/filters"
import { EReservationQueueStatus } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterBorrowReservationSchema,
  type TFilterBorrowReservationSchema,
} from "@/lib/validations/reservations/search-reservations"
import { filterBooleanSchema } from "@/lib/zod"
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
import BooleanFilter from "@/components/form/boolean-filter"
import DateRangePickerFilter from "@/components/form/date-range-picker-filter"
import SelectEnumFilter from "@/components/form/select-enum-filter"

function FiltersBorrowReservationsDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("BorrowAndReturnManagementPage")

  const tReservationQueueStatus = useTranslations(
    "Badges.ReservationQueueStatus"
  )

  const searchParams = useSearchParams()

  const form = useForm<TFilterBorrowReservationSchema>({
    resolver: zodResolver(filterBorrowReservationSchema),
    defaultValues: {
      reservationDateRange: parseSearchParamsDateRange(
        searchParams.getAll("reservationDateRange")
      ),
      expiryDateRange: parseSearchParamsDateRange(
        searchParams.getAll("expiryDateRange")
      ),
      assignDateRange: parseSearchParamsDateRange(
        searchParams.getAll("assignDateRange")
      ),
      collectedDateRange: parseSearchParamsDateRange(
        searchParams.getAll("collectedDateRange")
      ),
      expectedAvailableDateMinRange: parseSearchParamsDateRange(
        searchParams.getAll("expectedAvailableDateMinRange")
      ),
      expectedAvailableDateMaxRange: parseSearchParamsDateRange(
        searchParams.getAll("expectedAvailableDateMaxRange")
      ),

      queueStatus: searchParams.get("queueStatus") || undefined,
      isReservedAfterRequestFailed: filterBooleanSchema().parse(
        searchParams.get("isReservedAfterRequestFailed")
      ),
      isAppliedLabel: filterBooleanSchema().parse(
        searchParams.get("isAppliedLabel")
      ),
      isNotified: filterBooleanSchema().parse(searchParams.get("isNotified")),
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

    router.push("/management/borrows/reservations")
  }

  const wStatus = form.watch("queueStatus")
  const wIsAppliedLabel = form.watch("isAppliedLabel")
  const wIsNotified = form.watch("isNotified")
  const wIsReservedAfterRequestFailed = form.watch(
    "isReservedAfterRequestFailed"
  )

  const onSubmit = async (values: TFilterBorrowReservationSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        search: null,
        pageIndex: "1",
        queueStatus: values.queueStatus || null,
        isReservedAfterRequestFailed:
          values.isReservedAfterRequestFailed === undefined
            ? null
            : values.isReservedAfterRequestFailed
              ? "true"
              : "false",
        isAppliedLabel:
          values.isAppliedLabel === undefined
            ? null
            : values.isAppliedLabel
              ? "true"
              : "false",
        isNotified:
          values.isNotified === undefined
            ? null
            : values.isNotified
              ? "true"
              : "false",
        reservationDateRange: parseQueryDateRange(values.reservationDateRange),
        expiryDateRange: parseQueryDateRange(values.expiryDateRange),
        assignDateRange: parseQueryDateRange(values.assignDateRange),
        collectedDateRange: parseQueryDateRange(values.collectedDateRange),
        expectedAvailableDateMinRange: parseQueryDateRange(
          values.expectedAvailableDateMinRange
        ),
        expectedAvailableDateMaxRange: parseQueryDateRange(
          values.expectedAvailableDateMaxRange
        ),
      },
    })

    setOpen(false)
    router.replace(newUrl, { scroll: false })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-l-none" variant="outline">
          <Filter />

          {t("Filters")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Filters borrow reservations")}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-2 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="isAppliedLabel"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{t("Applied label")}</FormLabel>
                        <FormControl>
                          <BooleanFilter
                            //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                            value={wIsAppliedLabel}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isNotified"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{t("Notified")}</FormLabel>
                        <FormControl>
                          <BooleanFilter
                            //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                            value={wIsNotified}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isReservedAfterRequestFailed"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          {t("Reserved after request failed")}
                        </FormLabel>
                        <FormControl>
                          <BooleanFilter
                            //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                            value={wIsReservedAfterRequestFailed}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="queueStatus"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("Status")}</FormLabel>
                        <SelectEnumFilter
                          //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                          value={wStatus}
                          onChange={field.onChange}
                          enumObj={EReservationQueueStatus}
                          tEnum={tReservationQueueStatus}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reservationDateRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("Reservation date")}</FormLabel>
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
                    name="expiryDateRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("Expiry date")}</FormLabel>
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
                    name="assignDateRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("Assigned date")}</FormLabel>
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
                    name="collectedDateRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("Collected date")}</FormLabel>
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
                    name="expectedAvailableDateMinRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("Expected date min")}</FormLabel>
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
                    name="expectedAvailableDateMaxRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("Expected date max")}</FormLabel>
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

export default FiltersBorrowReservationsDialog
