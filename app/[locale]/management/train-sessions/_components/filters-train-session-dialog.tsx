/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { parseQueryDateRange, parseSearchParamsDateRange } from "@/lib/filters"
import { ETrainingStatus } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import {
  filterTrainSessionSchema,
  type TFilterTrainSessionSchema,
} from "@/lib/validations/ai/search-train-sessions"
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

function FiltersTrainSessionsDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("TrackingsManagementPage")
  const tTrainingStatus = useTranslations("Badges.TrainingStatus")

  const searchParams = useSearchParams()

  const form = useForm<TFilterTrainSessionSchema>({
    resolver: zodResolver(filterTrainSessionSchema),
    defaultValues: {
      trainDateRange: parseSearchParamsDateRange(
        searchParams.getAll("trainDateRange")
      ),

      trainingStatus: searchParams.get("trainingStatus") || undefined,
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
    router.push("/management/trainSessions")
  }

  const wTrainingStatus = form.watch("trainingStatus")

  const onSubmit = async (values: TFilterTrainSessionSchema) => {
    setOpen(false)

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        trainingStatus: values.trainingStatus || null,
        trainDateRange: parseQueryDateRange(values.trainDateRange),
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
          <DialogTitle>{t("Filters trainSessions")}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="trainingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Status")}</FormLabel>
                      <SelectEnumFilter
                        //*Bug of react hook form, must use form.watch instead field.value to get the expected behavior
                        value={wTrainingStatus}
                        onChange={field.onChange}
                        enumObj={ETrainingStatus}
                        tEnum={tTrainingStatus}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trainDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Training date")}</FormLabel>
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

export default FiltersTrainSessionsDialog
