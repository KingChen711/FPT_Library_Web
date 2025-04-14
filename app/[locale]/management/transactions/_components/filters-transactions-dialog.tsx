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
import {
  ETransactionMethod,
  ETransactionStatus,
  ETransactionType,
} from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterTransactionSchema,
  type TFilterTransactionSchema,
} from "@/lib/validations/transactions/search-transaction"
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

function FiltersTransactionsDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("TransactionsManagementPage")
  const tTransactionStatus = useTranslations("Badges.TransactionStatus")
  const tTransactionType = useTranslations("Badges.TransactionType")
  const tTransactionMethod = useTranslations("Badges.TransactionMethod")

  const searchParams = useSearchParams()

  const form = useForm<TFilterTransactionSchema>({
    resolver: zodResolver(filterTransactionSchema),
    defaultValues: {
      amountRange: parseSearchParamsNumRange(
        searchParams.getAll("amountRange")
      ),
      transactionDateRange: parseSearchParamsDateRange(
        searchParams.getAll("transactionDateRange")
      ),
      expiredAtRange: parseSearchParamsDateRange(
        searchParams.getAll("expiredAtRange")
      ),
      cancelledAtRange: parseSearchParamsDateRange(
        searchParams.getAll("cancelledAtRange")
      ),

      transactionStatus: searchParams.get("transactionStatus") || undefined,
      transactionMethod: searchParams.get("transactionMethod") || undefined,
      transactionType: searchParams.get("transactionType") || undefined,
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
    router.push("/management/transactions")
  }

  const wStatus = form.watch("transactionStatus")
  const wMethod = form.watch("transactionMethod")
  const wType = form.watch("transactionType")

  const onSubmit = async (values: TFilterTransactionSchema) => {
    setOpen(false)

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        transactionStatus: values.transactionStatus || null,
        transactionType: values.transactionType || null,
        transactionMethod: values.transactionMethod || null,
        amountRange: parseQueryNumRange(values.amountRange),
        transactionDateRange: parseQueryDateRange(values.transactionDateRange),
        expiredAtRange: parseQueryDateRange(values.expiredAtRange),
        cancelledAtRange: parseQueryDateRange(values.cancelledAtRange),
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

      <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Filters transactions")}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="transactionStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Status")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wStatus}
                        onChange={field.onChange}
                        enumObj={ETransactionStatus}
                        tEnum={tTransactionStatus}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Type")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wType}
                        onChange={field.onChange}
                        enumObj={ETransactionType}
                        tEnum={tTransactionType}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Method")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wMethod}
                        onChange={field.onChange}
                        enumObj={ETransactionMethod}
                        tEnum={tTransactionMethod}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amountRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Amount")}</FormLabel>
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
                  name="transactionDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Transaction date")}</FormLabel>
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
                  name="expiredAtRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Expired at")}</FormLabel>
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
                  name="cancelledAtRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Cancelled at")}</FormLabel>
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

export default FiltersTransactionsDialog
