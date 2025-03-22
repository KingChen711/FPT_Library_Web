/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { parseQueryDateRange, parseSearchParamsDateRange } from "@/lib/filters"
import { ENotificationType } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterNotificationSchema,
  type TFilterNotificationSchema,
} from "@/lib/validations/notifications/search-notifications"
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
import { Input } from "@/components/ui/input"
import BooleanFilter from "@/components/form/boolean-filter"
import DateRangePickerFilter from "@/components/form/date-range-picker-filter"
import SelectEnumFilter from "@/components/form/select-enum-filter"

function FiltersNotificationsDialog() {
  const router = useRouter()
  const t = useTranslations("NotificationsManagementPage")
  const [open, setOpen] = useState(false)
  const tNotificationType = useTranslations("Badges.NotificationType")

  const searchParams = useSearchParams()

  const form = useForm<TFilterNotificationSchema>({
    resolver: zodResolver(filterNotificationSchema),
    defaultValues: {
      createDateRange: parseSearchParamsDateRange(
        searchParams.getAll("createdAtRange")
      ),
      isPublic: filterBooleanSchema().parse(searchParams.get("isPublic")),
      notificationType: searchParams.get("notificationType") || undefined,
      email: searchParams.get("email") || undefined,
      createdBy: searchParams.get("createdBy") || undefined,
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

  const wIsPublic = form.watch("isPublic")
  const wNotificationType = form.watch("notificationType")

  const onSubmit = async (values: TFilterNotificationSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        createDateRange: parseQueryDateRange(values.createDateRange),
        isPublic:
          values.isPublic === undefined
            ? null
            : values.isPublic
              ? "true"
              : "false",
        notificationType: values.notificationType || null,
        email: values.email || null,
        createdBy: values.createdBy || null,
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

      <DialogContent className="max-h-[80vh] w-full">
        <DialogHeader>
          <DialogTitle>{t("Filter notifications")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="notificationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Notification type")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wNotificationType}
                        onChange={field.onChange}
                        enumObj={ENotificationType}
                        tEnum={tNotificationType}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Public")}?</FormLabel>
                      <FormControl>
                        <BooleanFilter
                          //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                          value={wIsPublic}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="createDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Created date")}</FormLabel>

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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Recipient")}</FormLabel>

                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="createdBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Sender")}</FormLabel>

                      <FormControl>
                        <Input type="email" {...field} />
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

export default FiltersNotificationsDialog
