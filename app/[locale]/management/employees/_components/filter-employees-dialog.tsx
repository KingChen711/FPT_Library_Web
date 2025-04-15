/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { parseQueryDateRange, parseSearchParamsDateRange } from "@/lib/filters"
import { EGender } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterEmployeeSchema,
  type TFilterEmployeeSchema,
} from "@/lib/validations/employee/search-employee"
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
import { Input } from "@/components/ui/input"
import DateRangePickerFilter from "@/components/form/date-range-picker-filter"
import SelectEnumFilter from "@/components/form/select-enum-filter"

function FiltersEmployeesDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("GeneralManagement")
  const tGender = useTranslations("Badges.Gender")

  const searchParams = useSearchParams()

  const form = useForm<TFilterEmployeeSchema>({
    resolver: zodResolver(filterEmployeeSchema),
    defaultValues: {
      dobRange: parseSearchParamsDateRange(searchParams.getAll("dobRange")),
      createDateRange: parseSearchParamsDateRange(
        searchParams.getAll("createDateRange")
      ),
      modifiedDateRange: parseSearchParamsDateRange(
        searchParams.getAll("modifiedDateRange")
      ),
      hireDateRange: parseSearchParamsDateRange(
        searchParams.getAll("hireDateRange")
      ),

      gender: searchParams.get("gender") || undefined,
      firstName: searchParams.get("fields.firstName") || undefined,
      lastName: searchParams.get("lastName") || undefined,
      employeeCode: searchParams.get("employeeCode") || undefined,
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
    router.push("/management/employees")
  }

  const wGender = form.watch("gender")

  const onSubmit = async (values: TFilterEmployeeSchema) => {
    setOpen(false)

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        gender: values.gender || null,
        firstName: values.firstName || null,
        lastName: values.lastName || null,

        dobRange: parseQueryDateRange(values.dobRange),
        createDateRange: parseQueryDateRange(values.createDateRange),
        modifiedDateRange: parseQueryDateRange(values.modifiedDateRange),
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
          <DialogTitle>{t("Filters employees")}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.employeeCode")}</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.firstName")}</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.lastName")}</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.gender")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wGender}
                        onChange={field.onChange}
                        enumObj={EGender}
                        stringEnum
                        tEnum={tGender}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hireDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.hireDate")}</FormLabel>
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
                      <FormLabel>{t("fields.dobRange")}</FormLabel>
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
                  name="createDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.createDateRange")}</FormLabel>
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
                  name="modifiedDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.modifiedDateRange")}</FormLabel>
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

export default FiltersEmployeesDialog
