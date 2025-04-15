/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { parseQueryNumRange } from "@/lib/filters"
import {
  filterAIRecommendsSchema,
  type TFilterAIRecommendsSchema,
  type TSearchAIRecommendsSchema,
} from "@/lib/validations/trackings/search-ai-recommend"
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
import NumRangeFilter from "@/components/form/num-range-filter"

type Props = {
  searchParams: TSearchAIRecommendsSchema
  setSearchParams: React.Dispatch<
    React.SetStateAction<TSearchAIRecommendsSchema>
  >
}

function FiltersRecommendsDialog({ searchParams, setSearchParams }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("TrackingsManagementPage")

  const form = useForm<TFilterAIRecommendsSchema>({
    resolver: zodResolver(filterAIRecommendsSchema),
    defaultValues: {
      pageCountRange: searchParams.pageCountRange,
      averageRatingRange: searchParams.averageRatingRange,
      ratingsCountRange: searchParams.ratingsCountRange,
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
    router.push("/management/recommends")
  }

  const onSubmit = async (values: TFilterAIRecommendsSchema) => {
    const pageCountRange = parseQueryNumRange(values.pageCountRange).map(
      (a) => {
        if (typeof a === "string") return +a
        return null
      }
    )
    const averageRatingRange = parseQueryNumRange(
      values.averageRatingRange
    ).map((a) => {
      if (typeof a === "string") return +a
      return null
    })
    const ratingsCountRange = parseQueryNumRange(values.ratingsCountRange).map(
      (a) => {
        if (typeof a === "string") return +a
        return null
      }
    )

    setSearchParams((prev) => ({
      ...prev,
      pageCountRange,
      averageRatingRange,
      ratingsCountRange,
    }))

    setOpen(false)
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
          <DialogTitle>{t("Filters recommends")}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 pt-2"
              >
                <FormField
                  control={form.control}
                  name="pageCountRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Page count")}</FormLabel>
                      <FormControl>
                        <NumRangeFilter
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="averageRatingRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Average rating")}</FormLabel>
                      <FormControl>
                        <NumRangeFilter
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ratingsCountRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Ratings count")}</FormLabel>
                      <FormControl>
                        <NumRangeFilter
                          onChange={field.onChange}
                          value={field.value}
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

export default FiltersRecommendsDialog
