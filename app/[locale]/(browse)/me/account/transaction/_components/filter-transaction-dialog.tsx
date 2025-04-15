/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useState } from "react"
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
} from "@/lib/validations/transactions/search-transactions"
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

const FilterTransactionDialog = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("TransactionPage")

  const tBadgeTransactionMethod = useTranslations("Badges.TransactionMethod")
  const tBadgeTransactionStatus = useTranslations("Badges.TransactionStatus")
  const tBadgeTransactionType = useTranslations("Badges.TransactionType")

  const searchParams = useSearchParams()

  const form = useForm<TFilterTransactionSchema>({
    resolver: zodResolver(filterTransactionSchema),
    defaultValues: {
      transactionStatus: searchParams.get("transactionStatus") || undefined,
      transactionType: searchParams.get("transactionType") || undefined,
      transactionMethod: searchParams.get("transactionMethod") || undefined,
      amountRange: parseSearchParamsNumRange(
        searchParams.getAll("amountRange")
      ),
      transactionDateRange: parseSearchParamsDateRange(
        searchParams.getAll("transactionDateRange")
      ),
      expirationDateRange: parseSearchParamsDateRange(
        searchParams.getAll("expirationDateRange")
      ),
      cancelledAtRange: parseSearchParamsDateRange(
        searchParams.getAll("cancelledAtRange")
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
    router.push("/me/account/transaction")
  }

  const wTransactionStatus = form.watch("transactionStatus")
  const wTransactionType = form.watch("transactionType")
  const wTransactionMethod = form.watch("transactionMethod")

  const onSubmit = async (values: TFilterTransactionSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        searchTransaction: null,
        pageIndex: "1",
        transactionStatus: values.transactionStatus || null,
        transactionType: values.transactionType || null,
        transactionMethod: values.transactionMethod || null,
        amountRange: parseQueryNumRange(values.amountRange),
        transactionDateRange: parseQueryDateRange(values.transactionDateRange),
        expirationDateRange: parseQueryDateRange(values.expirationDateRange),
        cancelledAtRange: parseQueryDateRange(values.cancelledAtRange),
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

          {t("filters")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("filters transactions")}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-2 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="transactionStatus"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("transactionStatus")}</FormLabel>
                        <SelectEnumFilter
                          value={wTransactionStatus}
                          onChange={field.onChange}
                          enumObj={ETransactionStatus}
                          tEnum={tBadgeTransactionStatus}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transactionType"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("transactionType")}</FormLabel>
                        <SelectEnumFilter
                          value={wTransactionType}
                          onChange={field.onChange}
                          enumObj={ETransactionType}
                          tEnum={tBadgeTransactionType}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transactionMethod"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("transactionMethod")}</FormLabel>
                        <SelectEnumFilter
                          value={wTransactionMethod}
                          onChange={field.onChange}
                          enumObj={ETransactionMethod}
                          tEnum={tBadgeTransactionMethod}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amountRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("amount")}</FormLabel>
                        <FormControl>
                          <NumRangeFilter
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
                    name="transactionDateRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("transactionDate")}</FormLabel>
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
                    name="expirationDateRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("expiredAt")}</FormLabel>
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
                      <FormItem className="shrink-0">
                        <FormLabel>{t("cancelledAt")}</FormLabel>
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
                    {t("cancel")}
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
                  {t("reset")}
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  className="float-right mt-4"
                >
                  {t("apply")}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default FilterTransactionDialog
