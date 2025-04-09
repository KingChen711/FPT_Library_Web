/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  EAdvancedFilterType,
  EFilterOperator,
} from "@/constants/advance-search/common"
import {
  borrowRecordAdvancedFilters,
  EAdvancedFilterBorrowRecordField,
} from "@/constants/advanced-filter-borrow-records"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { parseQueryDateRange, parseSearchParamsDateRange } from "@/lib/filters"
import { EBorrowType } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterBorrowRecordSchema,
  type TFilterBorrowRecordSchema,
} from "@/lib/validations/borrow-records/search-borrow-records"
import { filterEnumSchema } from "@/lib/zod"
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
import { Label } from "@/components/ui/label"
import DateRangePickerFilter from "@/components/form/date-range-picker-filter"
import SelectEnumFilter from "@/components/form/select-enum-filter"

import AdvancedSearchSection, { type FOV } from "./advanced-search-section"

function FiltersBorrowRecordsDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("BorrowAndReturnManagementPage")

  const tBorrowType = useTranslations("Badges.BorrowType")

  const searchParams = useSearchParams()

  const form = useForm<TFilterBorrowRecordSchema>({
    resolver: zodResolver(filterBorrowRecordSchema),
    defaultValues: {
      borrowDateRange: parseSearchParamsDateRange(
        searchParams.getAll("borrowDateRange")
      ),

      borrowType: searchParams.get("borrowType") || undefined,
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
    setQueries([])
    router.push("/me/account/borrow")
  }

  const wBorrowType = form.watch("borrowType")

  const onSubmit = async (values: TFilterBorrowRecordSchema) => {
    const filteredQuery = queries
      .filter((fov) => !!fov.f)
      .map((f) => {
        if (Array.isArray(f.v)) {
          return {
            ...f,
            v: f.v
              .map((a) =>
                a === null ? "null" : format(new Date(a), "yyyy-MM-dd")
              )
              .join(","),
            id: undefined,
          }
        }
        return { ...f, id: undefined }
      })

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        f: filteredQuery.map((f) => f.f),
        o: filteredQuery.map((f) => (f.o === null ? "null" : f.o.toString())),
        v: filteredQuery.map((f) => f.v?.toString() || ""),
        search: null,
        pageIndex: "1",
        borrowType: values.borrowType || null,
        borrowDateRange: parseQueryDateRange(values.borrowDateRange),
      },
    })

    setOpen(false)
    router.replace(newUrl, { scroll: false })
  }

  const fs = useMemo(
    () =>
      z
        .array(
          filterEnumSchema(EAdvancedFilterBorrowRecordField, undefined, true)
        )
        .transform((data) => (data.some((i) => i === undefined) ? [] : data))
        .catch([])
        .parse(searchParams.getAll("f")),
    [searchParams]
  )

  const os = useMemo(
    () =>
      z
        .array(filterEnumSchema(EFilterOperator))
        .transform((data) => (data.some((i) => i === undefined) ? [] : data))
        .catch([])
        .parse(searchParams.getAll("o")),
    [searchParams]
  )

  const vs = useMemo(() => searchParams.getAll("v"), [searchParams])

  const [queries, setQueries] = useState<FOV[]>(() => {
    if (
      fs.length !== os.length ||
      fs.length !== vs.length ||
      [fs.length, os.length, vs.length].some((l) => l === 0)
    )
      return []

    return fs.map((f, i) => {
      const type = borrowRecordAdvancedFilters.find((a) => a.field === f)!.type

      let value: string | number | [Date | null, Date | null] | null = ""

      switch (type) {
        case EAdvancedFilterType.TEXT:
          value = vs[i] || null
          break

        case EAdvancedFilterType.SELECT_DYNAMIC:
          value = Number(vs[i]) || null
          break

        default:
      }

      return {
        id: uuidv4(),
        f: f as EAdvancedFilterBorrowRecordField,
        o: os[i] ? +os[i] : null,
        v: value,
      }
    }) as FOV[]
  })

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
          <DialogTitle>{t("Filters borrowRecords")}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-2 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="borrowType"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("BorrowRecord type")}</FormLabel>
                        <SelectEnumFilter
                          //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                          value={wBorrowType}
                          onChange={field.onChange}
                          enumObj={EBorrowType}
                          tEnum={tBorrowType}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="borrowDateRange"
                    render={({ field }) => (
                      <FormItem className="shrink-0">
                        <FormLabel>{t("Borrow date")}</FormLabel>
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

              <div className="flex flex-col gap-2">
                <Label>{t("Advance search")}</Label>
                <AdvancedSearchSection
                  queries={queries}
                  setQueries={setQueries}
                />
              </div>
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

export default FiltersBorrowRecordsDialog
