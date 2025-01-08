"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ENotificationType, EVisibility } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/date-time-picker"
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

const typeOptions = [
  "All",
  ENotificationType.EVENT,
  ENotificationType.NOTICE,
  ENotificationType.REMINDER,
] as const

const visibilityOptions = [
  "All",
  EVisibility.PUBLIC,
  EVisibility.PRIVATE,
] as const

export const filterNotificationSchema = z.object({
  type: z.enum(typeOptions).catch("All"),
  visibility: z.enum(visibilityOptions).catch("All"),
  CreateDateRange: z.array(z.date().or(z.null())).catch([null, null]),
})

export type TFilterNotificationSchema = z.infer<typeof filterNotificationSchema>

function FiltersNotificationsDialog() {
  const router = useRouter()
  const t = useTranslations("NotificationsManagementPage")
  const [open, setOpen] = useState(false)

  const searchParams = useSearchParams()

  const form = useForm<TFilterNotificationSchema>({
    resolver: zodResolver(filterNotificationSchema),
    defaultValues: {
      type: "All",
      visibility: "All",
      CreateDateRange: [null, null],
    },
  })

  const resetFilters = () => {
    form.setValue("type", "All")
    form.setValue("visibility", "All")
    form.setValue("CreateDateRange", [null, null])
  }

  const onSubmit = async (values: TFilterNotificationSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        notificationType: values.type === "All" ? null : values.type,
        //TODO: filter visibility
        CreateDateRange: values.CreateDateRange.map((date) =>
          date ? format(date, "yyyy-MM-dd") : ""
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

      <DialogContent className="max-h-[90vh] w-full">
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Notification type")}</FormLabel>
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
                          {typeOptions.map((option) => (
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
                  name="CreateDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Created date")}</FormLabel>

                      <div className="flex w-fit flex-wrap items-center justify-between gap-3">
                        <DateTimePicker
                          jsDate={field.value[0] || undefined}
                          onJsDateChange={(date) =>
                            field.onChange([date || null, field.value[1]])
                          }
                          disabled={(date) =>
                            !!field.value[1] && date > new Date(field.value[1])
                          }
                        />

                        <div>-</div>

                        <DateTimePicker
                          jsDate={field.value[1] || undefined}
                          onJsDateChange={(date) =>
                            field.onChange([field.value[0], date || null])
                          }
                          disabled={(date) =>
                            !!field.value[0] && date < new Date(field.value[0])
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
