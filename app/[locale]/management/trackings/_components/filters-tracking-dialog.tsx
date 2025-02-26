"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone } from "@internationalized/date"
import { format } from "date-fns"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { ETrackingStatus, ETrackingType } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterTrackingSchema,
  type TFilterTrackingSchema,
} from "@/lib/validations/trackings/search-trackings"
import { Button } from "@/components/ui/button"
import {
  createCalendarDate,
  DateTimePicker,
} from "@/components/ui/date-time-picker/index"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function FiltersTrackingsDialog() {
  const timezone = getLocalTimeZone()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("TrackingsManagementPage")
  const tTrackingStatus = useTranslations("Badges.TrackingStatus")

  const searchParams = useSearchParams()

  const form = useForm<TFilterTrackingSchema>({
    resolver: zodResolver(filterTrackingSchema),
    defaultValues: {
      actualReturnDateRange: [null, null],
      createdAtRange: [null, null],
      entryDateRange: [null, null],
      expectedReturnDateRange: [null, null],
      totalAmountRange: [null, null],
      totalItemRange: [null, null],
      updatedAtRange: [null, null],
    },
  })

  const resetFilters = () => {
    form.setValue("trackingType", undefined)
    form.setValue("status", undefined)
    form.setValue("actualReturnDateRange", [null, null])
    form.setValue("createdAtRange", [null, null])
    form.setValue("entryDateRange", [null, null])
    form.setValue("expectedReturnDateRange", [null, null])
    form.setValue("totalAmountRange", [null, null])
    form.setValue("totalItemRange", [null, null])
    form.setValue("updatedAtRange", [null, null])
  }

  const onSubmit = async (values: TFilterTrackingSchema) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        trackingType: values.trackingType
          ? values.trackingType.toString()
          : null,
        status: values.status ? values.status.toString() : null,
        actualReturnDateRange: values.actualReturnDateRange.map((date) =>
          date ? format(date, "dd-MM-yyyy") : JSON.stringify(null)
        ),
        createdAtRange: values.createdAtRange.map((date) =>
          date ? format(date, "dd-MM-yyyy") : JSON.stringify(null)
        ),
        updatedAtRange: values.updatedAtRange.map((date) =>
          date ? format(date, "dd-MM-yyyy") : JSON.stringify(null)
        ),
        expectedReturnDateRange: values.expectedReturnDateRange.map((date) =>
          date ? format(date, "dd-MM-yyyy") : JSON.stringify(null)
        ),
        entryDateRange: values.entryDateRange.map((date) =>
          date ? format(date, "dd-MM-yyyy") : JSON.stringify(null)
        ),
        totalAmountRange: values.totalAmountRange.map((number) =>
          number ? number.toString() : JSON.stringify(null)
        ),
        totalItemRange: values.totalItemRange.map((number) =>
          number ? number.toString() : JSON.stringify(null)
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

      <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Filters trackings")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Status")}</FormLabel>
                      <Select
                        value={field.value ? field.value.toString() : "All"}
                        onValueChange={(val) =>
                          field.onChange(val === "All" ? undefined : +val)
                        }
                        defaultValue={
                          field.value ? field.value.toString() : "All"
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="All">{t("All")}</SelectItem>
                          {Object.values(ETrackingStatus)
                            .filter((value) => typeof value === "number")
                            .map((option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {tTrackingStatus(option.toString())}
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
                  name="trackingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Tracking type")}</FormLabel>
                      <Select
                        value={field.value ? field.value.toString() : "All"}
                        onValueChange={(val) =>
                          field.onChange(val === "All" ? undefined : +val)
                        }
                        defaultValue={
                          field.value ? field.value.toString() : "All"
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="All">{t("All")}</SelectItem>
                          {Object.values(ETrackingType)
                            .filter((value) => typeof value === "number")
                            .map((option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {tTrackingStatus(option.toString())}
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
                  name="totalItemRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Total item")}</FormLabel>

                      <div className="flex items-center justify-between gap-3">
                        Min
                        <Input
                          type="number"
                          value={field.value[0] || undefined}
                          onChange={(e) =>
                            field.onChange([
                              Number.isSafeInteger(Number(e.target.value))
                                ? Number(e.target.value)
                                : null,
                              field.value[1],
                            ])
                          }
                        />
                        <div>-</div>
                        Max
                        <Input
                          type="number"
                          value={field.value[0] || undefined}
                          onChange={(e) =>
                            field.onChange([
                              field.value[0],
                              Number.isSafeInteger(Number(e.target.value))
                                ? Number(e.target.value)
                                : null,
                            ])
                          }
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalAmountRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Total amount")}</FormLabel>

                      <div className="flex items-center justify-between gap-3">
                        Min
                        <Input
                          type="number"
                          value={field.value[0] || undefined}
                          onChange={(e) =>
                            field.onChange([
                              Number(e.target.value)
                                ? Number(e.target.value)
                                : null,
                              field.value[1],
                            ])
                          }
                        />
                        <div>-</div>
                        Max
                        <Input
                          type="number"
                          value={field.value[0] || undefined}
                          onChange={(e) =>
                            field.onChange([
                              field.value[0],
                              Number(e.target.value)
                                ? Number(e.target.value)
                                : null,
                            ])
                          }
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entryDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Entry date")}</FormLabel>

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
                            !!field.value[1] && date > new Date(field.value[1])
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
                            !!field.value[0] && date < new Date(field.value[0])
                          }
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedReturnDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Expected return date")}</FormLabel>

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
                            !!field.value[1] && date > new Date(field.value[1])
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
                            !!field.value[0] && date < new Date(field.value[0])
                          }
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="actualReturnDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Actual return date")}</FormLabel>

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
                            !!field.value[1] && date > new Date(field.value[1])
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
                            !!field.value[0] && date < new Date(field.value[0])
                          }
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="createdAtRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Created at")}</FormLabel>

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
                            !!field.value[1] && date > new Date(field.value[1])
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
                            !!field.value[0] && date < new Date(field.value[0])
                          }
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="updatedAtRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Updated at")}</FormLabel>

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
                            !!field.value[1] && date > new Date(field.value[1])
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

export default FiltersTrackingsDialog

//TODO: pick date not work
