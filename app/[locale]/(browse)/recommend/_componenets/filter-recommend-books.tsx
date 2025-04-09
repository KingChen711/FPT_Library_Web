/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { formUrlQuery } from "@/lib/utils"
import {
  searchRecommendSchema,
  type TSearchRecommendSchema,
} from "@/lib/validations/books/search-recommend-schema"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

function FilterRecommendBooks() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const t = useTranslations("RecommendPage")

  const searchParams = useSearchParams()

  const form = useForm<TSearchRecommendSchema>({
    resolver: zodResolver(searchRecommendSchema),
    defaultValues: {
      includeAuthor: filterBooleanSchema("true").parse(
        searchParams.get("includeAuthor")
      ),
      includeGenres: filterBooleanSchema("true").parse(
        searchParams.get("includeGenres")
      ),
      includeTitle: filterBooleanSchema("true").parse(
        searchParams.get("includeTitle")
      ),
      includeTopicalTerms: filterBooleanSchema("false").parse(
        searchParams.get("includeTopicalTerms")
      ),
      limitWorksOfAuthor: filterBooleanSchema("true").parse(
        searchParams.get("limitWorksOfAuthor")
      ),
      bestRecommend: filterBooleanSchema("true").parse(
        searchParams.get("bestRecommend")
      ),
    },
  })

  useEffect(() => {}, [])

  const onSubmit = async (values: TSearchRecommendSchema) => {
    setOpen(false)

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        pageIndex: "1",
        includeAuthor: values.includeAuthor ? "true" : "false",
        bestRecommend: values.bestRecommend ? "true" : "false",
        includeGenres: values.includeGenres ? "true" : "false",
        includeTitle: values.includeTitle ? "true" : "false",
        includeTopicalTerms: values.includeTopicalTerms ? "true" : "false",
        limitWorksOfAuthor: values.limitWorksOfAuthor ? "true" : "false",
      },
    })
    setOpen(false)
    router.replace(newUrl, { scroll: false })
  }

  const wBestRecommend = form.watch("bestRecommend")

  useEffect(() => {
    form.setValue("includeAuthor", true)
    form.setValue("includeGenres", true)
    form.setValue("includeTitle", true)
    form.setValue("limitWorksOfAuthor", true)
    form.setValue("includeTopicalTerms", false)
  }, [wBestRecommend, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-full rounded-md" variant="outline">
          <Filter />
          {t("Filters")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Filters recommend")}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <div className="mt-2 flex flex-col gap-2">
                  <Label>{t("Best recommend")}</Label>
                  <FormField
                    control={form.control}
                    name="bestRecommend"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{t("Best recommend")}</FormLabel>
                          <FormDescription>
                            {t("Best recommend desc")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />

                <div className="flex flex-col gap-2">
                  <Label>{t("Custom")}</Label>
                  <FormField
                    control={form.control}
                    name="includeTitle"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{t("Include title")}</FormLabel>
                          <FormDescription>
                            {t("Include title desc")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={wBestRecommend}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="includeAuthor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t("Include author")}</FormLabel>
                        <FormDescription>
                          {t("Include author desc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={wBestRecommend}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="includeGenres"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t("Include genre")}</FormLabel>
                        <FormDescription>
                          {t("Include genre desc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={wBestRecommend}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeTopicalTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t("Include topical term")}</FormLabel>
                        <FormDescription>
                          {t("Include topical term desc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={wBestRecommend}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="limitWorksOfAuthor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t("Limit works of author")}</FormLabel>
                        <FormDescription>
                          {t("Limit works of author desc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={wBestRecommend}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button variant="secondary" className="float-right">
                      {t("Cancel")}
                    </Button>
                  </DialogClose>

                  <Button type="submit" className="float-right">
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

export default FilterRecommendBooks
