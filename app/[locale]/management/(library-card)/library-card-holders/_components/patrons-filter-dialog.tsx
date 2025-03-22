/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { parseQueryDateRange, parseSearchParamsDateRange } from "@/lib/filters"
import { ECardStatus, EIdxGender, EIssuanceMethod } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterPatronSchema,
  type TFilterPatronSchema,
} from "@/lib/validations/patrons/search-patrons"
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

function FiltersPatronsDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("LibraryCardManagementPage")
  const tGender = useTranslations("Badges.Gender")
  const tCardStatus = useTranslations("Badges.CardStatus")
  const tIssuanceMethod = useTranslations("Badges.IssuanceMethod")

  const searchParams = useSearchParams()

  const form = useForm<TFilterPatronSchema>({
    resolver: zodResolver(filterPatronSchema),
    defaultValues: {
      cardExpiryDateRange: parseSearchParamsDateRange(
        searchParams.getAll("cardExpiryDateRange")
      ),
      cardIssueDateRange: parseSearchParamsDateRange(
        searchParams.getAll("cardIssueDateRange")
      ),
      suspensionDateRange: parseSearchParamsDateRange(
        searchParams.getAll("suspensionDateRange")
      ),
      dobRange: parseSearchParamsDateRange(searchParams.getAll("dobRange")),

      cardStatus: searchParams.get("cardStatus") || undefined,
      gender: searchParams.get("gender") || undefined,
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
    router.push("/management/library-card-holders")
  }

  const wCardStatus = form.watch("cardStatus")
  const wGender = form.watch("gender")
  const wIssuanceMethod = form.watch("issuanceMethod")
  const wIsAllowBorrowMore = form.watch("isAllowBorrowMore")
  const wIsArchived = form.watch("isArchived")
  const wIsExtended = form.watch("isExtended")
  const wIsReminderSent = form.watch("isReminderSent")

  const onSubmit = async (values: TFilterPatronSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        cardExpiryDateRange: parseQueryDateRange(values.cardExpiryDateRange),
        cardIssueDateRange: parseQueryDateRange(values.cardIssueDateRange),
        suspensionDateRange: parseQueryDateRange(values.suspensionDateRange),
        dobRange: parseQueryDateRange(values.dobRange),

        cardStatus: values.cardStatus || null,
        gender: values.gender || null,
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

    console.log({ values, newUrl, wIsAllowBorrowMore })

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
          <DialogTitle>{t("Filters patrons")}</DialogTitle>
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Gender")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wGender}
                        onChange={field.onChange}
                        enumObj={EIdxGender}
                        tEnum={tGender}
                      />

                      <FormMessage />
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
                  name="cardStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Card status")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wCardStatus}
                        onChange={field.onChange}
                        enumObj={ECardStatus}
                        tEnum={tCardStatus}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardIssueDateRange"
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
                  name="cardExpiryDateRange"
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
                <FormField
                  control={form.control}
                  name="dobRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dob")}</FormLabel>

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

export default FiltersPatronsDialog
