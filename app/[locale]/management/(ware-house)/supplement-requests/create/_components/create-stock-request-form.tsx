"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone } from "@internationalized/date"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Category } from "@/lib/types/models"
import {
  createSupplementRequestSchema,
  type TCreateSupplementRequestSchema,
} from "@/lib/validations/supplement/create-supplement-request"
import { createSupplementRequest } from "@/actions/trackings/create-supplement-request"
import useCategories from "@/hooks/categories/use-categories"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CurrencyInput } from "@/components/form/currency-input"
import {
  createCalendarDate,
  DateTimePicker,
} from "@/components/form/date-time-picker"

import SupplementBooks from "./supplement-books"
import TrackingDetailsField from "./tracking-details-field"

function CreateStockRequestForm() {
  const timezone = getLocalTimeZone()
  const t = useTranslations("TrackingsManagementPage")
  const router = useRouter()
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const { data: categoryItems } = useCategories()
  const form = useForm<TCreateSupplementRequestSchema>({
    resolver: zodResolver(createSupplementRequestSchema),
    defaultValues: {
      totalAmount: 0,
      totalItem: 0,
      warehouseTrackingDetails: [],
      supplementRequestDetails: [],
    },
  })

  const [selectedCategories, setSelectedCategories] = useState<
    (Category | null)[]
  >([])

  const onSubmit = async (values: TCreateSupplementRequestSchema) => {
    console.log(values)

    startTransition(async () => {
      const res = await createSupplementRequest(values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        router.push("/management/supplement-requests")
        return
      }

      handleServerActionError(res, locale, form)
    })
  }

  const triggerCatalogs = async () => {
    let flag = true

    const rows = form.watch("warehouseTrackingDetails")

    const triggerGlobal = await form.trigger([
      "description",
      "entryDate",
      "totalAmount",
      "totalItem",
      "dataFinalizationDate",
    ])

    flag = triggerGlobal

    for (let i = 0; i < rows.length; ++i) {
      const row = rows[i]

      const selectedCategory =
        selectedCategories[i] ||
        (row.categoryId
          ? categoryItems?.find((c) => c.categoryId === row.categoryId)
          : null)

      if (
        selectedCategory?.isAllowAITraining &&
        !form.watch(`warehouseTrackingDetails.${i}.isbn`)
      ) {
        form.setError(`warehouseTrackingDetails.${i}.isbn`, { message: "min1" })
        flag = false
      }
    }
    return flag
  }

  useEffect(() => {
    console.log(form.formState.errors)
  }, [form.formState.errors])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-wrap gap-6">
          <FormField
            control={form.control}
            name="entryDate"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1">
                <FormLabel>
                  {t("Entry date")}
                  <span className="ml-1 text-xl font-bold leading-none text-primary">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={createCalendarDate(field.value)}
                    onChange={(date) =>
                      field.onChange(date ? date.toDate(timezone) : null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataFinalizationDate"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1">
                <FormLabel>
                  {t("Data finalization date")}
                  <span className="ml-1 text-xl font-bold leading-none text-primary">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={createCalendarDate(field.value)}
                    onChange={(date) =>
                      field.onChange(date ? date.toDate(timezone) : null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <FormField
            control={form.control}
            name="totalItem"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {t("Total item")}
                  <span className="ml-1 text-xl font-bold leading-none text-primary">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled type="number" step="1" />
                </FormControl>
                <FormDescription>{t("Auto calculated")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalAmount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {t("Total amount")}
                  <span className="ml-1 text-xl font-bold leading-none text-primary">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <CurrencyInput {...field} disabled type="number" />
                </FormControl>
                <FormDescription>{t("Auto calculated")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t("Description")}</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TrackingDetailsField
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          form={form}
          isPending={isPending}
        />

        <SupplementBooks form={form} />

        <div className="flex items-center justify-end gap-4">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              router.push("/management/trackings")
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            disabled={isPending}
            onClick={async (e) => {
              if (!(await triggerCatalogs())) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          >
            {t("Create")}
            {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CreateStockRequestForm
