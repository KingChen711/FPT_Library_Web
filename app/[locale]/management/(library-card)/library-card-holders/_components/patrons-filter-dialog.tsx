"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone } from "@internationalized/date"
import { format } from "date-fns"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { ECardStatus, EIdxGender, EIssuanceMethod } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterPatronSchema,
  type TFilterPatronSchema,
} from "@/lib/validations/patrons/search-patrons"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function FiltersPatronsDialog() {
  const timezone = getLocalTimeZone()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("LibraryCardManagementPage")
  const tGender = useTranslations("Badges.Gender")
  const tCardStatus = useTranslations("Badges.CardStatus")
  const tIssuanceMethod = useTranslations("Badges.IssuanceMethod")

  const searchParams = useSearchParams()

  const form = useForm<TFilterPatronSchema>({
    resolver: zodResolver(filterPatronSchema),
    defaultValues: {
      cardIssueDateRange: [null, null],
      cardExpiryDateRange: [null, null],
      suspensionDateRange: [null, null],
      dobRange: [null, null],
    },
  })

  const resetFilters = () => {
    form.setValue("gender", undefined)
    form.setValue("issuanceMethod", undefined)
    form.setValue("cardStatus", undefined)

    form.setValue("isAllowBorrowMore", undefined)
    form.setValue("isReminderSent", undefined)
    form.setValue("isExtended", undefined)
    form.setValue("isArchived", undefined)

    form.setValue("cardIssueDateRange", [null, null])
    form.setValue("cardExpiryDateRange", [null, null])
    form.setValue("suspensionDateRange", [null, null])
    form.setValue("dobRange", [null, null])
  }

  const onSubmit = async (values: TFilterPatronSchema) => {
    console.log({
      gender: values.gender ? values.gender.toString() : null,
      issuanceMethod: values.issuanceMethod
        ? values.issuanceMethod.toString()
        : null,
      cardStatus: values.cardStatus ? values.cardStatus.toString() : null,

      isAllowBorrowMore:
        values.isAllowBorrowMore === undefined
          ? null
          : values.isAllowBorrowMore
            ? "true"
            : "false",
      isReminderSent:
        values.isAllowBorrowMore === undefined
          ? null
          : values.isAllowBorrowMore
            ? "true"
            : "false",
      isExtended:
        values.isAllowBorrowMore === undefined
          ? null
          : values.isAllowBorrowMore
            ? "true"
            : "false",
      isArchived:
        values.isAllowBorrowMore === undefined
          ? null
          : values.isAllowBorrowMore
            ? "true"
            : "false",
    })

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        gender: values.gender ? values.gender.toString() : null,
        issuanceMethod: values.issuanceMethod
          ? values.issuanceMethod.toString()
          : null,
        cardStatus: values.cardStatus ? values.cardStatus.toString() : null,

        isAllowBorrowMore:
          values.isAllowBorrowMore === undefined
            ? null
            : values.isAllowBorrowMore
              ? "true"
              : "false",
        isReminderSent:
          values.isAllowBorrowMore === undefined
            ? null
            : values.isAllowBorrowMore
              ? "true"
              : "false",
        isExtended:
          values.isAllowBorrowMore === undefined
            ? null
            : values.isAllowBorrowMore
              ? "true"
              : "false",
        isArchived:
          values.isAllowBorrowMore === undefined
            ? null
            : values.isAllowBorrowMore
              ? "true"
              : "false",

        cardIssueDateRange: values.cardIssueDateRange.map((date) =>
          date ? format(date, "dd-MM-yyyy") : JSON.stringify(null)
        ),
        cardExpiryDateRange: values.cardExpiryDateRange.map((date) =>
          date ? format(date, "dd-MM-yyyy") : JSON.stringify(null)
        ),
        suspensionDateRange: values.suspensionDateRange.map((date) =>
          date ? format(date, "dd-MM-yyyy") : JSON.stringify(null)
        ),
        dobRange: values.dobRange.map((date) =>
          date ? format(date, "dd-MM-yyyy") : JSON.stringify(null)
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
          <DialogTitle>{t("Filters patrons")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="isAllowBorrowMore"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Allow borrow more")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) =>
                            field.onChange(
                              val === "all" ? undefined : val === "1"
                            )
                          }
                          defaultValue={
                            field.value === undefined
                              ? "all"
                              : field.value
                                ? "1"
                                : "0"
                          }
                          className="flex flex-row gap-4"
                        >
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="all" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("All")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("Yes")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="0" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("No")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isReminderSent"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Reminder sent")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) =>
                            field.onChange(
                              val === "all" ? undefined : val === "1"
                            )
                          }
                          defaultValue={
                            field.value === undefined
                              ? "all"
                              : field.value
                                ? "1"
                                : "0"
                          }
                          className="flex flex-row gap-4"
                        >
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="all" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("All")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("Yes")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="0" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("No")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isExtended"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Extended")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) =>
                            field.onChange(
                              val === "all" ? undefined : val === "1"
                            )
                          }
                          defaultValue={
                            field.value === undefined
                              ? "all"
                              : field.value
                                ? "1"
                                : "0"
                          }
                          className="flex flex-row gap-4"
                        >
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="all" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("All")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("Yes")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="0" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("No")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isArchived"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Archived")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) =>
                            field.onChange(
                              val === "all" ? undefined : val === "1"
                            )
                          }
                          defaultValue={
                            field.value === undefined
                              ? "all"
                              : field.value
                                ? "1"
                                : "0"
                          }
                          className="flex flex-row gap-4"
                        >
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="all" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("All")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("Yes")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="0" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("No")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Gender")}</FormLabel>
                      <Select
                        value={
                          field.value === undefined
                            ? "All"
                            : field.value.toString()
                        }
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
                          {Object.values(EIdxGender)
                            .filter((e) => typeof e === "number")
                            .map((option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {tGender(option.toString())}
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
                  name="issuanceMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Issuance method")}</FormLabel>
                      <Select
                        value={
                          field.value === undefined
                            ? "All"
                            : field.value.toString()
                        }
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
                          {Object.values(EIssuanceMethod)
                            .filter((e) => typeof e === "number")
                            .map((option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {tIssuanceMethod(option.toString())}
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
                  name="cardStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Card status")}</FormLabel>
                      <Select
                        value={
                          field.value === undefined
                            ? "All"
                            : field.value.toString()
                        }
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
                          {Object.values(ECardStatus)
                            .filter((e) => typeof e === "number")
                            .map((option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {tCardStatus(option.toString())}
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
                  name="cardIssueDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Card issue date")}</FormLabel>

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
                  name="cardExpiryDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Card expiry date")}</FormLabel>

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
                  name="suspensionDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Suspension date")}</FormLabel>

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
                  name="dobRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dob")}</FormLabel>

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

export default FiltersPatronsDialog
