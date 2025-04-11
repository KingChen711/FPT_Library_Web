/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { parseQueryDateRange, parseSearchParamsDateRange } from "@/lib/filters"
import { formUrlQuery } from "@/lib/utils"
import {
  filterAuthorSchema,
  type TFilterAuthorSchema,
} from "@/lib/validations/author/search-author"
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

function FiltersAuthorsDialog() {
  const t = useTranslations("GeneralManagement")
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  const form = useForm<TFilterAuthorSchema>({
    resolver: zodResolver(filterAuthorSchema),
    defaultValues: {
      authorCode: searchParams.get("authorCode") || undefined,
      nationality: searchParams.get("nationality") || undefined,
      createDateRange: parseSearchParamsDateRange(
        searchParams.getAll("createDateRange")
      ),
      dateOfDeathRange: parseSearchParamsDateRange(
        searchParams.getAll("createDateRange")
      ),
      dobRange: parseSearchParamsDateRange(searchParams.getAll("dobRange")),
      modifiedDateRange: parseSearchParamsDateRange(
        searchParams.getAll("modifiedDateRange")
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

    router.push("/management/authors")
  }

  const onSubmit = async (values: TFilterAuthorSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        search: null,
        pageIndex: "1",
        authorCode: values.authorCode || null,
        nationality: values.nationality || null,
        createDateRange: parseQueryDateRange(values.createDateRange),
        dateOfDeathRange: parseQueryDateRange(values.dateOfDeathRange),
        dobRange: parseQueryDateRange(values.dobRange),
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
          {t("filter.title")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("filter.author")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="authorCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.authorCode")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("placeholder.code")} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.nationality")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("placeholder.nationality")}
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
                    <FormItem className="shrink-0">
                      <FormLabel>{t("fields.dob")}</FormLabel>
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
                  name="dateOfDeathRange"
                  render={({ field }) => (
                    <FormItem className="shrink-0">
                      <FormLabel>{t("fields.dateOfDeathRange")}</FormLabel>
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
                    <FormItem className="shrink-0">
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
                    <FormItem className="shrink-0">
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

export default FiltersAuthorsDialog
