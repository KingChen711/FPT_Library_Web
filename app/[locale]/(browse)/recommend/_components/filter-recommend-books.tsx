/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { formUrlQuery } from "@/lib/utils"
import {
  searchRecommendSchema,
  type TSearchRecommendSchema,
} from "@/lib/validations/books/search-recommend-schema"
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
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const t = useTranslations("RecommendPage")

  const searchParams = useSearchParams()

  const form = useForm<TSearchRecommendSchema>({
    resolver: zodResolver(searchRecommendSchema),
    defaultValues: {
      includeAuthor:
        searchParams.get("includeAuthor") === "false" ? "false" : "true",
      includeGenres:
        searchParams.get("includeGenres") === "false" ? "false" : "true",
      includeTitle:
        searchParams.get("includeTitle") === "false" ? "false" : "true",
      includeTopicalTerms:
        searchParams.get("includeTopicalTerms") === "false" ? "false" : "true",
      limitWorksOfAuthor:
        searchParams.get("limitWorksOfAuthor") === "true" ? "true" : "false",
      bestRecommend:
        searchParams.get("bestRecommend") === "false" ? "false" : "true",
    },
  })

  const wInCludeAuthor = form.watch("includeAuthor")
  const wInCludeTitle = form.watch("includeTitle")
  const wInCludeGenres = form.watch("includeGenres")
  const wInCludeTopicalTerms = form.watch("includeTopicalTerms")
  const wLimitWorksOfAuthor = form.watch("limitWorksOfAuthor")
  const wBestRecommend = form.watch("bestRecommend")

  const onSubmit = async () => {
    setOpen(false)

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        includeAuthor: wInCludeAuthor,
        bestRecommend: wBestRecommend,
        includeGenres: wInCludeGenres,
        includeTitle: wInCludeTitle,
        includeTopicalTerms: wInCludeTopicalTerms,
        limitWorksOfAuthor: wLimitWorksOfAuthor,
      },
    })
    setOpen(false)

    router.push(newUrl)
    queryClient.invalidateQueries({ queryKey: ["infinite-recommend-books"] })
    router.refresh()
  }

  useEffect(() => {
    if (wBestRecommend === "false") return
    form.setValue("includeAuthor", "true")
    form.setValue("includeGenres", "true")
    form.setValue("includeTitle", "true")
    form.setValue("limitWorksOfAuthor", "true")
    form.setValue("includeTopicalTerms", "false")
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
                    render={() => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{t("Best recommend")}</FormLabel>
                          <FormDescription>
                            {t("Best recommend desc")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            defaultChecked={wBestRecommend === "true"}
                            onCheckedChange={() =>
                              form.setValue(
                                "bestRecommend",
                                wBestRecommend === "true" ? "false" : "true"
                              )
                            }
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
                    render={() => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{t("Include title")}</FormLabel>
                          <FormDescription>
                            {t("Include title desc")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={wBestRecommend === "true"}
                            defaultChecked={wInCludeTitle === "true"}
                            onCheckedChange={() =>
                              form.setValue(
                                "includeTitle",
                                wInCludeTitle === "true" ? "false" : "true"
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="includeAuthor"
                  render={() => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t("Include author")}</FormLabel>
                        <FormDescription>
                          {t("Include author desc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={wBestRecommend === "true"}
                          defaultChecked={wInCludeAuthor === "true"}
                          onCheckedChange={() =>
                            form.setValue(
                              "includeAuthor",
                              wInCludeAuthor === "true" ? "false" : "true"
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="includeGenres"
                  render={() => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t("Include genre")}</FormLabel>
                        <FormDescription>
                          {t("Include genre desc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={wBestRecommend === "true"}
                          defaultChecked={wInCludeGenres === "true"}
                          onCheckedChange={() =>
                            form.setValue(
                              "includeGenres",
                              wInCludeGenres === "true" ? "false" : "true"
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeTopicalTerms"
                  render={() => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t("Include topical term")}</FormLabel>
                        <FormDescription>
                          {t("Include topical term desc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          defaultChecked={wInCludeTopicalTerms === "true"}
                          disabled={wBestRecommend === "true"}
                          onCheckedChange={() =>
                            form.setValue(
                              "includeTopicalTerms",
                              wInCludeTopicalTerms === "true" ? "false" : "true"
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="limitWorksOfAuthor"
                  render={() => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t("Limit works of author")}</FormLabel>
                        <FormDescription>
                          {t("Limit works of author desc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={wBestRecommend === "true"}
                          defaultChecked={wLimitWorksOfAuthor === "true"}
                          onCheckedChange={() =>
                            form.setValue(
                              "limitWorksOfAuthor",
                              wLimitWorksOfAuthor === "true" ? "false" : "true"
                            )
                          }
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
