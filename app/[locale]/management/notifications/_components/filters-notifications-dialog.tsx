"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone } from "@internationalized/date"
import { format } from "date-fns"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { ENotificationType } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterNotificationSchema,
  visibilityOptions,
  type TFilterNotificationSchema,
} from "@/lib/validations/notifications/search-notifications"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createCalendarDate,
  DateTimePicker,
} from "@/components/form/date-time-picker"

function FiltersNotificationsDialog() {
  const timezone = getLocalTimeZone()
  const router = useRouter()
  const t = useTranslations("NotificationsManagementPage")
  const [open, setOpen] = useState(false)

  const searchParams = useSearchParams()

  const form = useForm<TFilterNotificationSchema>({
    resolver: zodResolver(filterNotificationSchema),
    defaultValues: {
      visibility: "All",
      createDateRange: [null, null],
    },
  })

  const resetFilters = () => {
    form.setValue("notificationType", undefined)
    form.setValue("visibility", "All")
    form.setValue("createDateRange", [null, null])
  }

  const onSubmit = async (values: TFilterNotificationSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        notificationType:
          values.notificationType === undefined
            ? null
            : values.notificationType.toString(),
        //TODO: filter visibility
        CreateDateRange: values.createDateRange.map((date) =>
          date ? format(date, "dd-MM-yyyy") : ""
        ),
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
                      <Select
                        onValueChange={(val) =>
                          field.onChange(val === "all" ? undefined : +val)
                        }
                        defaultValue={
                          field.value === undefined
                            ? "all"
                            : field.value.toString()
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">{t("All")}</SelectItem>
                          {Object.values(ENotificationType)
                            .filter((e) => typeof e === "number")
                            .map((option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {t(option)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Visibility")}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {visibilityOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {t(option)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

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

                      <div className="flex items-center justify-between gap-3">
                        <DateTimePicker
                          value={createCalendarDate(field.value[0])}
                          onChange={(date) =>
                            field.onChange([
                              date ? date.toDate(timezone) : null,
                              field.value[1],
                            ])
                          }
                          disabled={(date) =>
                            (!!field.value[1] &&
                              date > new Date(field.value[1])) ||
                            date > new Date()
                          }
                        />

                        <div>-</div>

                        <DateTimePicker
                          value={createCalendarDate(field.value[1])}
                          onChange={(date) =>
                            field.onChange([
                              field.value[0],
                              date ? date.toDate(timezone) : null,
                            ])
                          }
                          disabled={(date) =>
                            (!!field.value[0] &&
                              date < new Date(field.value[0])) ||
                            date > new Date()
                          }
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button variant="secondary" className="float-right mt-4">
                      Cancel
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
                    Reset
                  </Button>
                  <Button type="submit" className="float-right mt-4">
                    Apply{" "}
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
