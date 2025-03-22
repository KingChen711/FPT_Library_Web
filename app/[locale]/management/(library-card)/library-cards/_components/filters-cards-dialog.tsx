/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { parseQueryDateRange, parseSearchParamsDateRange } from "@/lib/filters"
import { ECardStatus, EIssuanceMethod } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterCardSchema,
  type TFilterCardSchema,
} from "@/lib/validations/patrons/cards/search-cards"
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

function FiltersCardsDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("LibraryCardManagementPage")

  const tStatus = useTranslations("Badges.CardStatus")
  const tIssuanceMethod = useTranslations("Badges.IssuanceMethod")

  const searchParams = useSearchParams()

  const form = useForm<TFilterCardSchema>({
    resolver: zodResolver(filterCardSchema),
    defaultValues: {
      expiryDateRange: parseSearchParamsDateRange(
        searchParams.getAll("expiryDateRange")
      ),
      issueDateRange: parseSearchParamsDateRange(
        searchParams.getAll("issueDateRange")
      ),
      suspensionDateRange: parseSearchParamsDateRange(
        searchParams.getAll("suspensionDateRange")
      ),

      status: searchParams.get("status") || undefined,

      issuanceMethod: searchParams.get("issuanceMethod") || undefined,

      isAllowBorrowMore: filterBooleanSchema().parse(
        searchParams.get("isAllowBorrowMore")
      ),
      isArchived: filterBooleanSchema().parse(searchParams.get("isArchived")),
      isExtended: filterBooleanSchema().parse(searchParams.get("isExtended")),
      isReminderSent: filterBooleanSchema().parse(
        searchParams.get("isReminderSent")
      ),
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
    router.push("/management/library-cards")
  }

  const wStatus = form.watch("status")

  const wIssuanceMethod = form.watch("issuanceMethod")
  const wIsAllowBorrowMore = form.watch("isAllowBorrowMore")
  const wIsArchived = form.watch("isArchived")
  const wIsExtended = form.watch("isExtended")
  const wIsReminderSent = form.watch("isReminderSent")

  const onSubmit = async (values: TFilterCardSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        expiryDateRange: parseQueryDateRange(values.expiryDateRange),
        issueDateRange: parseQueryDateRange(values.issueDateRange),
        suspensionDateRange: parseQueryDateRange(values.suspensionDateRange),

        status: values.status || null,

        issuanceMethod: values.issuanceMethod || null,

        isAllowBorrowMore:
          values.isAllowBorrowMore === undefined
            ? null
            : values.isAllowBorrowMore
              ? "true"
              : "false",
        isArchived:
          values.isArchived === undefined
            ? null
            : values.isArchived
              ? "true"
              : "false",
        isExtended:
          values.isExtended === undefined
            ? null
            : values.isExtended
              ? "true"
              : "false",
        isReminderSent:
          values.isReminderSent === undefined
            ? null
            : values.isReminderSent
              ? "true"
              : "false",
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

      <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Filters cards")}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="isAllowBorrowMore"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Allow borrow more")}</FormLabel>
                      <FormControl>
                        <BooleanFilter
                          //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                          value={wIsAllowBorrowMore}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isReminderSent"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Reminder sent")}</FormLabel>
                      <FormControl>
                        <BooleanFilter
                          //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                          value={wIsReminderSent}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isExtended"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Extended")}</FormLabel>
                      <FormControl>
                        <BooleanFilter
                          //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                          value={wIsExtended}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isArchived"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Archived")}</FormLabel>
                      <FormControl>
                        <BooleanFilter
                          //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                          value={wIsArchived}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issuanceMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Issuance method")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wIssuanceMethod}
                        onChange={field.onChange}
                        enumObj={EIssuanceMethod}
                        tEnum={tIssuanceMethod}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Card status")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wStatus}
                        onChange={field.onChange}
                        enumObj={ECardStatus}
                        tEnum={tStatus}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Card issue date")}</FormLabel>

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
                    <FormItem>
                      <FormLabel>{t("Card expiry date")}</FormLabel>

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
                  name="suspensionDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Suspension date")}</FormLabel>

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

export default FiltersCardsDialog
