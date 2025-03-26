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
  filterNotificationPrivacySchema,
  type TFilterNotificationPrivacySchema,
} from "@/lib/validations/notifications/search-privacy-notifications"
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
import SelectEnumFilter from "@/components/form/select-enum-filter"

function FiltersNotificationsDialog() {
  const router = useRouter()
  const t = useTranslations("NotificationsManagementPage")
  const [open, setOpen] = useState(false)
  const tNotificationType = useTranslations("Badges.NotificationType")

  const searchParams = useSearchParams()

  const form = useForm<TFilterNotificationPrivacySchema>({
    resolver: zodResolver(filterNotificationPrivacySchema),
    defaultValues: {
      createDateRange: parseSearchParamsDateRange(
        searchParams.getAll("createdAtRange")
      ),

      notificationType: searchParams.get("notificationType") || undefined,
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
    router.push("/me/account/notifications")
  }

  const wNotificationType = form.watch("notificationType")

  const onSubmit = async (values: TFilterNotificationPrivacySchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        createDateRange: parseQueryDateRange(values.createDateRange),

        notificationType: values.notificationType || null,
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
